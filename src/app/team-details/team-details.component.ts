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
        this.teamMembersTeamForm = team.teamMembers;
        console.log(this.teamForm.value);
      });
  }

  byId(teamLead: User, user: User): boolean {
    return teamLead.id === user.id;
  }

  addMember(): void {
    const userToBeAdded = this.teamForm.value.addTeamMember;
    const isFound = this.findMember(userToBeAdded);
    if (!isFound) {
      this.team.teamMembers.push(userToBeAdded);
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

  addTeamToUser(teamName: string, user: User, isForTeamLead: boolean): void {
    const teamForm = this.teamForm.value;
    const unupdatedTeamLead = this.team.teamLead;
    if (isForTeamLead) {
      const previousTeamNameIndex = this.team.teamLead.leadOnTeams.indexOf(this.team.teamName);
      unupdatedTeamLead.leadOnTeams.splice(previousTeamNameIndex, 1);
      if (this.team.teamLead.id !== teamForm.teamLead.id) {
        teamForm.teamLead.leadOnTeams.push(teamName);
        this.team = teamForm;
        this.team.teamMembers = this.teamMembersTeamForm;
        console.log(teamForm.teamLead);
        console.log(this.team, 'this team');
      } else {
        unupdatedTeamLead.leadOnTeams.push(teamName);
        this.team = teamForm;
        console.log(teamForm.teamLead);
        console.log(this.team, 'team lead');
      }
    } else {
      for (const eachMember of this.team.teamMembers) {
        let isUserRemoved = true;
        for (const member of this.teamMembersTeamForm) {
          const previousTeamNameIndex = member.memberOnTeams.indexOf(this.team.teamName);
          if (member.id === eachMember.id) {
            isUserRemoved = false;
            const indexOfUser = this.team.teamMembers.indexOf(eachMember);
            this.team.teamMembers.splice(indexOfUser, 1);
          }
          if (previousTeamNameIndex >= 0) {
            member.memberOnTeams.splice(previousTeamNameIndex, 1);
          }
          console.log(member.memberOnTeams);
          member.memberOnTeams.push(teamForm.teamName);
        }
        if (isUserRemoved) {
          const teamToDeleteIndex = eachMember.memberOnTeams.indexOf(this.team.teamName);
          eachMember.memberOnTeams.splice(teamToDeleteIndex, 1);
        }
      }
      console.log(teamForm);
      console.log(this.teamMembersTeamForm, 'team memvers form');
    }
    // if (teamLead) {
    //   if ( !(teamName in user.leadOnTeams)) {
    //   }
    // }
    // console.log('g');
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
      console.log('valid Form');
      if (teamForm.teamName !== this.team.teamName) {
        this.teamService.getTeamByName(teamForm.teamName)
          .subscribe(team => {
            if (team.length === 0) {
              // this.teamService.updateTeam(this.team)
              //   .subscribe();
              this.addTeamToUser(teamForm.teamName, this.team.teamLead, true);
              // console.log(this.team, 'update!');
            } else {
              this.errorMessage = 'Team Name already exists';
            }
          });
      } else {
        this.addTeamToUser(teamForm.teamName, this.team.teamLead, true);
      }
    }
  }
}
