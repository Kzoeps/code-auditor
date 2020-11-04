import {Component, OnInit} from '@angular/core';
import {TeamService} from '../team.service';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {User} from '../user';
import {UserService} from '../user.service';

// TODO: make sure team lead not an option for users, while also making sure it is an option if changed.
// basically if im the lead but on options i change then make available in members?
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private teamService: TeamService, private fb: FormBuilder, private userService: UserService) {
  }

  errorMessage: string;
  team: Team;
  users: User[];
  teamMembersTeamForm: User[];
  teamForm = this.fb.group({
    teamName: ['', [Validators.required]],
    dateEstd: ['', [Validators.required]],
    teamLead: ['', [Validators.required]],
    addTeamMember: ['']
  });

  ngOnInit(): void {
    this.getTeam();
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  getTeam(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.teamService.getTeam(id)
      .subscribe(team => {
        this.team = team;
        this.teamForm.controls.teamName.setValue(this.team.teamName);
        this.teamForm.controls.dateEstd.setValue(this.team.dateEstd);
        this.teamForm.controls.teamLead.setValue(this.team.teamLead);
        this.teamMembersTeamForm = team.teamMembers.map((user) => user);
      });
  }

  byId(teamLead: User, user: User): boolean {
    return teamLead.id === user.id;
  }

  addMember(): void {
    const userToBeAdded = this.teamForm.value.addTeamMember;
    const isFound = this.findMember(userToBeAdded);
    if (!isFound) {
      this.teamMembersTeamForm.push(userToBeAdded);
    }
  }

  findMember(user: User): boolean {
    for (const eachUser of this.teamMembersTeamForm) {
      if (user.id === eachUser.id) {
        return true;
      }
    }
    return false;
  }

  removeMember(id: number): void {
    for (const eachUser of this.teamMembersTeamForm) {
      if (id === eachUser.id) {
        const indexToDelete = this.teamMembersTeamForm.indexOf(eachUser);
        this.teamMembersTeamForm.splice(indexToDelete, 1);
        break;
      }
    }
  }

  addTeamToMembers(teamName: string, previousTeamName: string): void {
    for (const eachPreviousMember of this.team.teamMembers) {
      let isRemovedFromTeam = true;
      for (const eachNewMember of this.teamMembersTeamForm) {
        // TODO: change name of teamMembersTeamForm to updatedTeamMembers; also unupdated team lead to previousTeamLead
        const previousTeamNameIndex = eachNewMember.memberOnTeams.indexOf(previousTeamName);
        const previousTeamNameIndexForLead = eachNewMember.leadOnTeams.indexOf(previousTeamName);
        //  delete the previous teamName from the array of team names for user
        if (eachPreviousMember.id === eachNewMember.id) {
          isRemovedFromTeam = false;
          const indexOfNewMember = this.team.teamMembers.indexOf(eachPreviousMember);
          //  since this member is still on the team remove it from list of removed team members;
          this.team.teamMembers.splice(indexOfNewMember, 1);
        }
        if (previousTeamNameIndex >= 0) {
          //  if member was already part  of the team from before
          eachNewMember.memberOnTeams.splice(previousTeamNameIndex, 1);
        }
        if (previousTeamNameIndexForLead >= 0) {
          eachNewMember.leadOnTeams.splice(previousTeamNameIndexForLead, 1);
        }
        eachNewMember.memberOnTeams.push(teamName);
        this.userService.updateUser(eachNewMember)
          .subscribe();
      }
      if (isRemovedFromTeam) {
        const previousTeamNameIndex = eachPreviousMember.memberOnTeams.indexOf(previousTeamName);
        eachPreviousMember.memberOnTeams.splice(previousTeamNameIndex, 1);
        this.userService.updateUser(eachPreviousMember)
          .subscribe();
      }
    }
  }

  addTeamToLead(teamName: string): void {
    const teamForm = this.teamForm.value;
    const unupdatedTeamLead = this.team.teamLead;
    const previousTeamNameIndex = this.team.teamLead.leadOnTeams.indexOf(this.team.teamName);
    unupdatedTeamLead.leadOnTeams.splice(previousTeamNameIndex, 1);
    if (this.team.teamLead.id !== teamForm.teamLead.id) {
      teamForm.teamLead.leadOnTeams.push(teamName);
      delete(teamForm.teamLead.memberOnTeams);
      this.userService.updateUser(teamForm.teamLead)
        .subscribe();
      this.team = teamForm;
      this.team.teamMembers = this.teamMembersTeamForm;
      console.log(this.team, 'addTeamToLead()');
    } else {
      unupdatedTeamLead.leadOnTeams.push(teamName);
      delete(unupdatedTeamLead.memberOnTeams);
      this.userService.updateUser(unupdatedTeamLead)
        .subscribe();
      this.team = teamForm;
      this.team.teamMembers = this.teamMembersTeamForm;
      console.log(this.team, 'addTeamToLead()');
    }
  }

  updateTeam(): void {
    let validForm = true;
    if (this.teamMembersTeamForm.length === 0) {
      validForm = false;
      this.errorMessage = 'There has to be atleast one team member';
    }
    if (this.findMember(this.teamForm.value.teamLead)) {
      validForm = false;
      this.errorMessage = 'Team Lead cannot be a team member';
    }
    if (validForm) {
      const teamForm = this.teamForm.value;
      teamForm.teamName = teamForm.teamName.trim().toLowerCase();
      if (teamForm.teamName !== this.team.teamName) {
        this.teamService.getTeamByName(teamForm.teamName)
          .subscribe(team => {
            if (team.length === 0) {
              // this.teamService.updateTeam(this.team)
              //   .subscribe();
              this.addTeamToMembers(teamForm.teamName, this.team.teamName);
              this.addTeamToLead(teamForm.teamName);
              // console.log(this.team, 'update!');
            } else {
              this.errorMessage = 'Team Name already exists';
            }
          });
      } else {
        this.addTeamToMembers(teamForm.teamName, this.team.teamName);
        this.addTeamToLead(teamForm.teamName);
        // this.addTeamToUser(teamForm.teamName, this.team.teamLead, false);
      }
    }
  }
}
