import { Component, OnInit } from '@angular/core';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {TeamService} from '../team.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private fb: FormBuilder, private teamService: TeamService) { }

  team: Team;
  teamForm = this.fb.group({
    teamName: ['', [Validators.required]],
    dateEstd: ['', [Validators.required]],
    teamLead: ['', [Validators.required]],
    teamMembers: [[''], [Validators.required]],
  });
  ngOnInit(): void {
  }
  onSubmit(): void {
    this.team = this.teamForm.value;
    this.teamService.createTeam(this.team)
      .subscribe();
  }
}
