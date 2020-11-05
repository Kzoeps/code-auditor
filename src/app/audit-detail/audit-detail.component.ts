import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../audit.service';
import {Audit} from '../audit';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {TeamService} from '../team.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.css']
})
export class AuditDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService
  ) {
  }

  audit: Audit;
  auditors: Team[];
  teams: Team[];
  errorMessage: string;
  status = [
    'on-going',
    'closed',
    'cancelled'
  ];
  auditForm = this.fb.group({
    auditee: ['', [Validators.required]],
    auditorToAdd: [''],
    auditStartDate: ['', [Validators.required]],
    status: [''],
    memo: this.fb.group({
      description: [''],
      assignedTo: ['']
    })
  });

  ngOnInit(): void {
    this.getAudit();
    this.getTeams();
  }

  byId(team1: Team, team2: Team): boolean {
    return team1.id === team2.id;
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(teams => {
        this.teams = teams;
      });
  }

  addAuditor(): void {
    this.auditors.push(this.auditForm.value.auditorToAdd);
  }

  removeAuditor(auditor: Team): void {
    const teamIndex = this.auditors.indexOf(auditor);
    this.auditors.splice(teamIndex, 1);
  }

  byStatus(status1: string, status2: string): boolean {
    return status1 === status2;
  }

  getAudit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.auditService.getAudit(id)
      .subscribe(audit => {
        this.audit = audit;
        this.auditForm.controls.auditee.setValue(this.audit.auditee);
        this.auditForm.controls.auditStartDate.setValue(this.audit.auditStartDate);
        this.auditForm.controls.status.setValue(this.audit.status);
        this.auditors = this.audit.auditor.map((auditor) => auditor);
      });
  }

  addMemo(): void {

  }
}
