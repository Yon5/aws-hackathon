import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsValidators } from './forms.validator';
import { AllProjectTraceability } from 'src/app/models/all-project-traceability';
import { AllProjectTraceabilityTotal } from 'src/app/models/all-project-traceability-total';
// import { JiraService } from 'src/app/services/jira.service';
import { UsTraceabilityService } from 'src/app/services/us-traceability.service';
import { ReportCSI } from 'src/app/models/report-csi';
import { AllProjectIssues } from 'src/app/models/all-project-issues';
import { IssueCSI } from 'src/app/models/issue-csi';
import { Subscription } from 'rxjs';
import { Issues } from 'src/app/models/issues';
import { IssuesByProject } from  'src/app/models/issuesByProject';
import { Projects } from 'src/app/models/projects';
import { Release } from 'src/app/models/release';
import { ReleaseWithAlm } from 'src/app/models/releaseWithAlm';
import { Report } from 'src/app/models/report.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-individual-project-by-sprint',
  templateUrl: './individual-project-by-sprint.component.html',
  styleUrls: ['./individual-project-by-sprint.component.css']
})
//export class IndividualProjectByReleaseComponent implements OnInit, OnDestroy {
export class IndividualProjectBySprintComponent implements OnInit, OnDestroy {
  overallTraceability: number = 0;
  overallIssuesWithTest: number = 0;
  overallIssuesWithOutTest: number = 0;
  reportTraceabilityCSI: ReportCSI[] = [];
  reportTraceability: string = '';
  projectsWihtOutIssues: number = 0;
  TotalProjectsByRelease: number = -1;
  TraceabilityAll_calc: number = 0;
  total_testAllProjects: number = 0;
  total_testAllProjectsProject: number = 0;
  dateReport: string = '';
  allProjectsAlm: AllProjectTraceability[] = [];
  allProjects: AllProjectTraceability[] = [];
  mergeProjects: AllProjectTraceability[] = [];
  allProjectsRelease: AllProjectTraceability[] = [];
  row: AllProjectTraceability = {
    project: '',
    totalIssues: 0,
    traceability: 0,
    report: 'Digital',
    Issues: [],
    traceabilityAll: '0',
    release: [],
    IssuesWithTest: '',
    IssuesZeroTest: '',
    IssuesWithTestA: [],
    IssuesZeroTestA: [],
    IssuesWithTestAALM: [],
    IssuesZeroTestAALM: [],
    IssuesUnknownSource: [],
  };
  report: Report = {
    generated: '',
    traceability: '0',
    release: '',
    Report: [],
  };
  SaveReportMessage = '';
  statusSprint = '';
  statusRelease = '';
  statusAllProjects = '';
  status = '';
  Action = '';
  project = 'Ex: P0123';
  sprint = 'Ex: Digital.S03';
  projects: Projects[] = [];
  release: ReleaseWithAlm[] = [];
  issues: ReleaseWithAlm[] = [];
  issuesRelease: ReleaseWithAlm[] = [];
  SizeStories: number = null;
  issuesTotal: Issues[] = [];
  TraceabilitySprint_calc: number;
  issuesAlmWithTest: IssueCSI[] = [];
  issuesAlmWithOutTest: IssueCSI[] = [];
  issuesTotalRelease: Issues[] = [];
  issuesTotalReleaseWithAlm: IssuesByProject[] = [];
  //issuesTotalReleaseAlm: Issues[] = [];
  issuesTotalReleaseAlm: IssuesByProject[] = [];
  issuesTotalReleaseZephyr: IssuesByProject[] = [];
  issuesTotalReleaseUnKnown: IssuesByProject[] = [];
  TraceabilitySprint_calcRelease: number;
  TraceabilitySprint_calcReleaseAlm: number;
  TraceabilitySprint_calcReleaseZephyr: number;
  TraceabilitySprint: Issues[] = [];
  reportTraceabilityZephyr: string = '';
  reportTraceabilityZephyrRequirementsWithTest: number = 0;
  reportTraceabilityZephyrTotalRequirements: number = 0;
  reportTraceabilityAlm: string = '';
  reportTraceabilityAlmRequirementsWithTest: number = 0;
  reportTraceabilityAlmTotalRequirements: number = 0;
  dateAlmReport: string = '';
  withOutTestAlm: number = 0;
  withTestAlm: number = 0;
  withOutTestZephyr: number = 0;
  withTestZephyr: number = 0;
  private projectsSub: Subscription;
  private releaseSub: Subscription;
  private releaseSubJira: Subscription;
  private releaseSubJiraAndAlm: Subscription;
  private TraceabilitySprint_calcSub: Subscription;
  private AllProjectsTraceabilityByReleaseTraceabilitySub: Subscription;
  private AllProjectsAlmTraceabilityByReleaseTraceabilitySub: Subscription;
  private getSaveReportUpdateListenerSub: Subscription;
  private getReportUpdateListenerSub: Subscription;
  private gettraceabilityCSIUpdatedListenerSub: Subscription;
  indProjbySprint: any;


  formSprint = new FormGroup({
    sprintName: new FormControl('', [Validators.required]),
    sprintProject: new FormControl('', [
      Validators.required,
      Validators.pattern(/[/P]{1}[0-9]{7}/),
      FormsValidators.cannotContainSpace,
    ]),
  });
  constructor(public UsTraceabilityService: UsTraceabilityService) {};
  @ViewChild('indProjbySprint', { read: ElementRef }) table: ElementRef;
  ngAfterViewChecked() {
    if (this.table != undefined && !$.fn.dataTable.isDataTable(this.table.nativeElement)){
      $.fn.dataTable.ext.search = [
        function(settings, data, dataIndex ) {
          var zephyrTests = parseInt(data[2])
          var almTests = parseInt(data[3])
          if($('#zephyrtests').val()  == 2  && $('#almtests').val() == 2 ){
              if(zephyrTests >= 0 || almTests >= 0){
                return true
              }
            }else if($('#zephyrtests').val()  == 0  && $('#almtests').val() == 0){
              if(zephyrTests == 0 && almTests == 0){
                return true
              }
            }else if($('#zephyrtests').val()  == 1  && $('#almtests').val() == 1) {
              if(zephyrTests > 0 || almTests > 0){
                return true
              }
            }
            return false;
        }
      ];
      this.indProjbySprint = $(this.table.nativeElement);
      this.indProjbySprint.DataTable({
        "searching": true,
        retrieve: true,
        "select": true,
        "autoWidth":false,
        "info":false,
        "JQueryUI":true,
        "ordering":true,
        "paging":true,
        "scrollY":"300px",
        "scrollCollapse":true,

        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'pdf',{
          text: 'Traceability = 0',
          action: function (e, dt, node, config){
            $('#zephyrtests').val('0');
            $('#almtests').val('0');
            $('#indProjbySprint').DataTable().draw();
            $("button.dt-button.active").removeClass('active');
            $(node).addClass('active');
          }
        },{
          text: 'Traceability >  0',
          key: '1',
          action: function (e, dt, node, config) {
            $('#zephyrtests').val('1');
            $('#almtests').val('1');
            $('#indProjbySprint').DataTable().draw();
            $("button.dt-button.active").removeClass('active');
            $(node).addClass('active');
          }
        },{
          text: 'Complete Traceability',
          key: '1',
          className: 'active',
          action: function (e, dt, node, config) {
            $('#zephyrtests').val('2');
            $('#almtests').val('2');
            $('#indProjbySprint').DataTable().draw();
            $("button.dt-button.active").removeClass('active');
            $(node).addClass('active');
          }
        }
      ]

      })
    }
  }
  ngOnInit(): void {
  }
  onClink(
    sprintInput: HTMLInputElement,
    projectInput: HTMLInputElement,
    actionInput: HTMLInputElement
  ) {
    if (actionInput.value === 'sprint') {
      this.Action = actionInput.value;
      this.project = projectInput.value;
      this.statusRelease = 'Fetching data in progress . . .';
      this.issuesTotalRelease = [];
      this.issuesTotalReleaseAlm = [];
      this.issues = [];
      this.issuesRelease = [];
      this.allProjectsRelease = [];
      this.allProjects = [];
      this.TraceabilitySprint_calcReleaseAlm = 0;
      this.TraceabilitySprint_calcReleaseZephyr = 0;
      this.TraceabilitySprint_calcRelease = 0;
      this.issuesTotalReleaseAlm = [];
      this.issuesTotalReleaseZephyr = [];
      this.issuesTotalReleaseUnKnown = [];
      this.TraceabilitySprint_calcRelease= 0;
      this.TraceabilitySprint_calcReleaseAlm= 0;
      this.TraceabilitySprint_calcReleaseZephyr= 0;
      this.TraceabilitySprint = [];
      this.reportTraceabilityZephyr = '';
      this.reportTraceabilityZephyrRequirementsWithTest = 0;
      this.reportTraceabilityZephyrTotalRequirements = 0;
      this.reportTraceabilityAlm = '';
      this.reportTraceabilityAlmRequirementsWithTest = 0;
      this.reportTraceabilityAlmTotalRequirements = 0;
      this.dateAlmReport = '';
      this.withOutTestAlm = 0;
      this.withTestAlm = 0;
      this.withOutTestZephyr = 0;
      this.withTestZephyr  = 0;
      this.issuesRelease = [];
      this.issuesTotalReleaseWithAlm = [];
    }
    this.issues = [];
    this.issuesRelease = [];
    this.allProjectsRelease = [];
    this.allProjects = [];

    this.UsTraceabilityService.getReleaseByProjectJiraAndAlmSprint(sprintInput.value,projectInput.value,actionInput.value);



      if (!this.releaseSubJira) {

      this.releaseSubJira = this.UsTraceabilityService.getReleaseUpdateListenerJira().subscribe(
        (issues: ReleaseWithAlm[]) => {
            if (issues.length <= 0 ) {
            this.statusRelease = 'no data';
          } else {
             if (actionInput.value === 'sprint' && issues.length > 0 ) {
              this.statusRelease = 'pulling';
              this.issuesRelease = issues;
              this.UsTraceabilityService.getTraceabilitAySprint_calc2(this.issuesRelease);
              issues.forEach(issue => {
                var totalA:number = 0;
                var issueWithALM:IssuesByProject =  {'csi':issue.fields.customfield_10602,'totalA':0,'totalZ':0,'key':issue.key};
                 if(issue.fields.subtasks.length !=0 ){
                  issue.fields.subtasks.forEach(subtask => {
                    if(subtask.fields.summary.toLowerCase().includes("test execution")||subtask.fields.summary.toLowerCase().includes("test case execution") || subtask.fields.summary.toLowerCase().includes("test case")||subtask.fields.summary.toLowerCase().includes("test scripts")||subtask.fields.summary.toLowerCase().includes("script")||subtask.fields.summary.toLowerCase().includes("test")){
                  totalA = totalA + 1;
                  }else{
                    totalA = totalA;
                  }
                  });
              if (totalA != 0) {
                issueWithALM.totalA = totalA;
                this.issuesTotalReleaseWithAlm.push(issueWithALM);
              }else{
                this.issuesTotalReleaseWithAlm.push(issueWithALM);
                }
            }else{
              this.issuesTotalReleaseWithAlm.push(issueWithALM);
            }
              });
            }
          }
        }
      );
    }


    this.TraceabilitySprint_calcSub = this.UsTraceabilityService.getTraceabilitySprintUpdatedListenerJira().subscribe(
      (data) => {
       if (actionInput.value === 'sprint') {
              var totalAZ:number = 0;
              data.Report.forEach(element => {
               var issueWithALM:IssuesByProject =  {'csi':element.csi,'totalA':0,'totalZ':element.total,'key':element.key};
               var index = this.issuesTotalReleaseWithAlm.findIndex((x) => x.key == element.key);
               if(index != -1){
                 this.issuesTotalReleaseWithAlm[index].totalZ = element.total;
               }else{
                 this.issuesTotalReleaseWithAlm.push(issueWithALM);
               }
               if(this.issuesTotalReleaseWithAlm[index].totalZ != 0 || this.issuesTotalReleaseWithAlm[index].totalA != 0){
                 totalAZ = totalAZ + 1
               }
              });
              this.TraceabilitySprint_calcRelease =  ((totalAZ/this.issuesTotalReleaseWithAlm.length)*100);
              if(this.issuesTotalReleaseWithAlm.length == this.issuesRelease.length){
               this.statusRelease = '';
              }
        }
      }
    );


}

ngOnDestroy() {
}
}
