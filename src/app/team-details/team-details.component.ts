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
      });
  }

  addMember(): void {
    const userToBeAdded = this.teamForm.value.addTeamMember;
    const isFound = this.findMember(userToBeAdded);
    if (!isFound) {
      this.team.teamMembers.push(userToBeAdded);
    }
  }

  findMember(user: User): boolean {
    for (const eachUser of this.team.teamMembers) {
      if (user.id === eachUser.id) {
        return true;
      }
    }
    return false;
  }

  removeMember(id: number): void {
    for (const eachUser of this.team.teamMembers) {
      if (id === eachUser.id) {
        const indexToDelete = this.team.teamMembers.indexOf(eachUser);
        this.team.teamMembers.splice(indexToDelete, 1);
        break;
      }
    }
  }

  addTeamToUser(teamName: string, user: User, teamLead: boolean): void {
    const teamForm = this.teamForm.value;
    const unupdatedTeamLead = this.team.teamLead;
    if (this.team.teamLead.id !== teamForm.teamLead.id) {
      const teamNameIndex = unupdatedTeamLead.leadOnTeams.indexOf(teamName);
      console.log(unupdatedTeamLead.leadOnTeams);
      console.log(teamNameIndex);
    }
    // if (teamLead) {
    //   if ( !(teamName in user.leadOnTeams)) {
    //   }
    // }
    // console.log('g');
  }

  updateTeam(): void {
    let validForm = true;
    if (this.team.teamMembers.length === 0) {
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
      }
    }
  }
}
