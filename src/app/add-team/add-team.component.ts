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

  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit(): void {
    this.team = this.teamForm.value;
    const id = +this.team.teamLead;
    if (id) {
      this.userService.getUserById(id)
        .subscribe((user) => {
          this.teamLead = user;
          this.team.teamLead = this.teamLead;
          this.teamService.createTeam(this.team)
            .subscribe();
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
