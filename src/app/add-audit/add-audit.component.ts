import {Component, OnInit} from '@angular/core';
import {TeamService} from '../team.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Team} from '../team';

@Component({
  selector: 'app-add-audit',
  templateUrl: './add-audit.component.html',
  styleUrls: ['./add-audit.component.css']
})
export class AddAuditComponent implements OnInit {

  constructor(private fb: FormBuilder, private teamService: TeamService) {
  }

  teams: Team[];
  errorMessage: string;
  auditForm = this.fb.group({
    auditee: ['', [Validators.required]],
    auditorToAdd: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    status: ['on-going']
  });

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(team => this.teams = team);
  }
}
