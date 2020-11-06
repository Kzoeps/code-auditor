import {Component, OnInit} from '@angular/core';
import {TeamService} from '../team.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Team} from '../team';
import {AuditService} from '../audit.service';
import {Audit} from '../audit';

// TODO: clear error message when form is submitted
@Component({
  selector: 'app-add-audit',
  templateUrl: './add-audit.component.html',
  styleUrls: ['./add-audit.component.css']
})
export class AddAuditComponent implements OnInit {

  constructor(private fb: FormBuilder, private teamService: TeamService, private auditService: AuditService) {
  }

  teams: Team[];
  errorMessage: string;
  auditors: Team[];
  auditForm = this.fb.group({
    auditee: ['', [Validators.required]],
    auditorToAdd: [''],
    auditStartDate: ['', [Validators.required]],
    status: ['on-going']
  });
  audit: Audit;

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(team => this.teams = team);
  }

  removeAuditor(auditorTeam: Team): void {
    const indexOfAuditorTeam = this.auditors.indexOf(auditorTeam);
    this.auditors.splice(indexOfAuditorTeam, 1);
  }

  addAuditor(): void {
    if (this.auditors) {
      this.auditors.push(this.auditForm.value.auditorToAdd);
    } else {
      this.auditors = [this.auditForm.value.auditorToAdd];
    }
  }

  findTeam(team: Team): boolean {
    const index = this.auditors.indexOf(team);
    if (index >= 0) {
      return true;
    }
  }

  createAudit(): void {
    let validForm = true;
    if (!(this.auditForm.valid)) {
      validForm = false;
      this.errorMessage = 'Enter All Required Fields';
    }
    if (this.auditors === undefined || this.auditors.length === 0) {
      validForm = false;
      this.errorMessage = 'Atleast one auditor is required';
    } else if (this.findTeam(this.auditForm.value.auditee)) {
      validForm = false;
      this.errorMessage = 'Auditee cannot be an auditor';
    }
    if (validForm) {
      this.errorMessage = '';
      delete (this.auditForm.value.auditorToAdd);
      this.audit = this.auditForm.value;
      this.audit.auditor = this.auditors;
      this.audit.memos = [];
      this.audit.tbd = [];
      this.audit.resolved = [];
      this.auditService.createAudit(this.audit)
        .subscribe(audit => {
          console.log(audit);
        });
    }
  }
}
