import {Component, OnInit} from '@angular/core';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {TeamService} from '../team.service';
import {User} from '../user';
import {UserService} from '../user.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private fb: FormBuilder, private teamService: TeamService, private userService: UserService) {
  }

  users: User[];
  teamLead: User;
  team: Team;
  teamForm = this.fb.group({
    teamName: ['', [Validators.required]],
    dateEstd: ['', [Validators.required]],
    teamLead: ['', [Validators.required]],
    teamMembers: [[''], [Validators.required]],
  });

  errorMessage: string;

  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit(): void {
    this.team = this.teamForm.value;
    const id = +this.team.teamLead;
    this.team.teamName = this.team.teamName.trim().toLowerCase();
    if (id) {
      this.userService.getUserById(id)
        .subscribe((user) => {
          this.teamLead = user;
          this.team.teamLead = this.teamLead;
          this.teamLead.leadOnTeams.push(this.team.teamName);
          this.teamService.getTeamByName(this.team.teamName)
            .subscribe(team => {
              if (team.length !== 0) {
                this.errorMessage = 'Team Name already exists!';
              } else {
                this.teamService.createTeam(this.team)
                  .subscribe(() => {
                    this.userService.updateUser(this.teamLead)
                      .subscribe();
                  });
              }
            });
        });
    } else {
      this.errorMessage = 'Team Lead doesnt exist in used db';
    }
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }
}
