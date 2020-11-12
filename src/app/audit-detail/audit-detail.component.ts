import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../audit.service';
import {Audit} from '../audit';
import {Team} from '../team';
import {FormBuilder, Validators} from '@angular/forms';
import {TeamService} from '../team.service';
import {UserService} from '../user.service';
import {Memo} from '../memo';
import {User} from '../user';

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
  memoErrorMessage: string;
  errorMessage: string;
  memos: Memo[];
  memo: Memo;
  resolved: Memo[];
  tbd: Memo[];
  memoAssignees: User[];
  status = [
    'on-going',
    'closed',
    'cancelled'
  ];
  sections = [
    'memo',
    'resolved',
    'tbd'
  ];
  auditForm = this.fb.group({
    auditee: ['', [Validators.required]],
    auditorToAdd: [''],
    auditStartDate: ['', [Validators.required]],
    status: [''],
    memo: this.fb.group({
      description: [''],
      assignedTo: ['']
    }),
    memoMoveSection: [''],
    resolvedMoveSection: [''],
    tbdMoveSection: [''],
    assignToMemoBox: [''],
  });

  ngOnInit(): void {
    this.getAudit();
    this.getTeams();
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(teams => {
        this.teams = teams;
      });
  }


  byStatus(status1: string, status2: string): boolean {
    return status1 === status2;
  }

  getAudit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.auditService.getAudit(id)
      .subscribe(audit => {
        this.audit = audit;
        console.log(this.audit.auditee.teamMembers);
        this.auditForm.controls.status.setValue(this.audit.status);
        this.auditors = this.audit.auditor.map((auditor) => auditor);
        this.memos = this.audit.memos.map((memo) => memo);
        this.resolved = this.audit.resolved.map((memo) => memo);
        this.tbd = this.audit.tbd.map((memo) => memo);
      });
  }

  findMemo(memo: Memo): boolean {
    const memoIndex = this.memos.indexOf(memo);
    return memoIndex >= 0;
  }

  addMemo(): void {
    this.memo = this.auditForm.value.memo;
    this.memo.description = this.memo.description.trim().toLowerCase();
    if (this.memo.description && this.memoAssignees) {
      this.memo.assignedTo = this.memoAssignees.map((assignee) => assignee);
      if (!(this.memos)) {
        this.memos = [this.memo];
      } else {
        if (!(this.findMemo(this.memo))) {
          this.memos.push(this.memo);
        }
      }
      this.memoErrorMessage = '';
      this.memoAssignees = [];
    } else {
      this.memoErrorMessage = 'Needs to have a description and has to be assigned to a member!';
    }
  }

  removeAssignee(assignee: User): void {
    const assigneeIndex = this.memoAssignees.indexOf(assignee);
    this.memoAssignees.splice(assigneeIndex, 1);
  }

  assign(): void {
    const assignee = this.auditForm.value.memo.assignedTo;
    if (assignee) {
      if (this.memoAssignees) {
        const userIndex = this.memoAssignees.indexOf(assignee);
        if (!(userIndex >= 0)) {
          this.memoAssignees.push(assignee);
        }
      } else {
        this.memoAssignees = [assignee];
      }
    }
  }

  updateAudit(): void {
    this.audit.status = this.auditForm.value.status;
    this.audit.memos = this.memos;
    this.audit.tbd = this.tbd;
    this.audit.resolved = this.resolved;
    this.auditService.updateAudit(this.audit)
      .subscribe(() => {
        console.log(this.audit.id, 'succesfully updated. Put Toast Here updateAudit()');
      });
  }

  move(memo: Memo, moveFromIndex: number): void {
    // the index of all arrays below follow this pattern : 0 = memos, 1 = resolved, 2=tbd
    const memoOptions = [this.memos, this.resolved, this.tbd];
    const moveOptions = [this.auditForm.value.memoMoveSection, this.auditForm.value.resolvedMoveSection,
      this.auditForm.value.tbdMoveSection];
    let validMove = true;
    const moveToIndex = this.sections.indexOf(moveOptions[moveFromIndex]);
    if (moveFromIndex === moveToIndex) {
      validMove = false;
    }
    if (validMove) {
      const memoIndex = memoOptions[moveFromIndex].indexOf(memo);
      memoOptions[moveToIndex].push(memo);
      memoOptions[moveFromIndex].splice(memoIndex, 1);
    }
  }

  removeMemo(memo: Memo, memoFrom: number): void {
    const sectionsList = [this.memos, this.resolved, this.tbd];
    const memoIndex = sectionsList[memoFrom].indexOf(memo);
    sectionsList[memoFrom].splice(memoIndex, 1);
  }

  removeAssigneeMemo(assignee: User, memo: Memo): void {
    const assigneeIndex = memo.assignedTo.indexOf(assignee);
    memo.assignedTo.splice(assigneeIndex, 1);
  }

  findAssignee(memo: Memo, assignee: User): boolean {
    let userFound = false;
    for (const users of memo.assignedTo) {
      if (users.id === assignee.id) {
        userFound = true;
      }
    }
    return (userFound);
  }

  memoAssignUpdate(memo: Memo): void {
    const assignee = this.auditForm.value.assignToMemoBox;
    if (!(this.findAssignee(memo, assignee))) {
      memo.assignedTo.push(assignee);
    }
  }
}
