import {Component, OnInit} from '@angular/core';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {TeamService} from '../team.service';
import {User} from '../user';
import {UserService} from '../user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private fb: FormBuilder, private teamService: TeamService, private userService: UserService, private toast: ToastrService) {
  }

  users: User[];
  teamLead: User;
  teamMembers: User[];
  team: Team;
  teamForm = this.fb.group({
    teamName: ['', [Validators.required]],
    dateEstd: ['', [Validators.required]],
    teamLead: ['', [Validators.required]],
    teamMembers: [[], [Validators.required]],
  });
  errorMessage: string;

  ngOnInit(): void {
    this.getUsers();
  }

  removeMember(id: number): void {
    for (const eachMember of this.teamMembers) {
      if (eachMember.id === id) {
        const index = this.teamMembers.indexOf(eachMember);
        this.teamMembers.splice(index, 1);
      }
    }
  }

  findMember(teamMember: number): boolean {
    for ( const eachUser of this.teamMembers) {
      if (eachUser.id === teamMember) {
        return true;
      }
    }
    return false;
  }
  onSubmit(): void {
    this.team = this.teamForm.value;
    const id = +this.team.teamLead;
    if (!(this.findMember(id))) {
      this.team.teamName = this.team.teamName.trim().toLowerCase();
      if (id) {
        this.userService.getUserById(id)
          .subscribe((user) => {
            this.teamLead = user;
            this.team.teamLead = this.teamLead;
            this.teamLead.leadOnTeams.push(this.team.teamName);
            this.team.teamMembers = this.teamMembers;
            this.teamService.getTeamByName(this.team.teamName)
              .subscribe(team => {
                if (team.length !== 0) {
                  this.errorMessage = 'Team Name already exists!';
                } else {
                  this.userService.updateUser(this.teamLead)
                    .subscribe();
                  for (const eachMember of this.teamMembers) {
                    eachMember.memberOnTeams.push(this.team.teamName);
                    this.userService.updateUser(eachMember)
                      .subscribe();
                  }
                  this.teamService.createTeam(this.team)
                    .subscribe(() => {
                      this.errorMessage = '';
                      this.toast.success('Created Team');
                      this.teamForm.reset();
                    });
                }
              });
          });
      } else {
        this.errorMessage = 'Team Lead doesnt exist in user db';
      }
    } else {
      this.errorMessage = 'Team Lead cannot be a team member';
    }
  }

  addMember(): void {
    const memberID = +this.teamForm.value.teamMembers;
    if (this.teamMembers) {
      let flag = false;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.teamMembers.length; i++) {
        if (this.teamMembers[i].id === memberID) {
          flag = true;
        }
      }
      if (!flag) {
        this.userService.getUserById(memberID)
          .subscribe(user => {
            this.teamMembers.push(user);
          });
      }
    } else {
      this.userService.getUserById(memberID)
        .subscribe(user => {
          this.teamMembers = [user];
        });
    }
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }
}
