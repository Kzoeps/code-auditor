import {Component, OnInit} from '@angular/core';
import {AuditService} from '../audit.service';
import {Audit} from '../audit';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  constructor(private auditService: AuditService) {
  }

  auditTeams: Audit[];

  ngOnInit(): void {
    this.getAudits();
  }

  getAudits(): void {
    this.auditService.getAudits()
      .subscribe(audits => {
        this.auditTeams = audits;
      });
  }
}
