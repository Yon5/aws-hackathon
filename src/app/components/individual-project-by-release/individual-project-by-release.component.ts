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
import { UsTraceabilityService } from 'src/app/services/us-traceability.service';
import { ReportCSI } from 'src/app/models/report-csi';
import { IssueCSI } from 'src/app/models/issue-csi';
import { Subscription } from 'rxjs';
import { Issues } from 'src/app/models/issues';
import { IssuesByProject } from  'src/app/models/issuesByProject';
import { Projects } from 'src/app/models/projects';
import { ReleaseWithAlm } from 'src/app/models/releaseWithAlm';
import { Report } from 'src/app/models/report.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-individual-project-by-release',
  templateUrl: './individual-project-by-release.component.html',
  styleUrls: ['./individual-project-by-release.component.css']
})
export class IndividualProjectByReleaseComponent implements OnInit, OnDestroy {
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
  private releaseSubJira: Subscription;
  private TraceabilitySprint_calcSub: Subscription;
  indProjbyRel: any;
  formRelease = new FormGroup({
    releaseProject: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
      Validators.pattern(/[0-9]{4}[/.]{1}[0-9]{2}/),
      ,
      FormsValidators.cannotContainSpace,
    ]),
    projectName: new FormControl('', [
      Validators.required,
      Validators.pattern(/[/P]{1}[0-9]{7}/),
      FormsValidators.cannotContainSpace,
    ]),
  });


  constructor(public UsTraceabilityService: UsTraceabilityService) {}
  @ViewChild('indProjbyRel', { read: ElementRef }) table: ElementRef;
  ngAfterViewChecked() {

    if (this.table != undefined && !$.fn.dataTable.isDataTable(this.table.nativeElement)){
      this.indProjbyRel = $(this.table.nativeElement);
      $.fn.dataTable.ext.search = [
        function( settings, data, dataIndex ) {
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
        }];
      this.indProjbyRel.DataTable({
        "searching": true,
        "Select": true,
        "retrieve": true,
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
            action: function (e, dt, node, config) {
                $('#zephyrtests').val('0');
                $('#almtests').val('0');
                $('#indProjbyRel').DataTable().draw();
                $("button.dt-button.active").removeClass('active');
                $(node).addClass('active');
            }
          },{
            text: 'Traceability >  0',
            key: '1',
            action: function (e, dt, node, config) {
              $('#zephyrtests').val('1');
              $('#almtests').val('1');
              $('#indProjbyRel').DataTable().draw();
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
              $('#indProjbyRel').DataTable().draw();
              $("button.dt-button.active").removeClass('active');
              $(node).addClass('active');
            }
          }]
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
    if (actionInput.value === 'release') {
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


    this.UsTraceabilityService.getReleaseByProjectJiraAndAlm(sprintInput.value,projectInput.value,actionInput.value);
    if (!this.releaseSubJira) {
      var projectAlm: Issues[];
      this.UsTraceabilityService.getAllProjectsAlm(sprintInput.value);
      this.UsTraceabilityService.getAllProjectsAlmUpdateListener().subscribe(
      (almReport: AllProjectTraceabilityTotal) => {
        this.allProjectsAlm = almReport.report;
        var index = this.allProjectsAlm.findIndex((x) => x.project === projectInput.value);
        if(index != -1){
          projectAlm = this.allProjectsAlm[index].release;
        }else{
          projectAlm = [];
        }

      });

      this.releaseSubJira = this.UsTraceabilityService.getReleaseUpdateListenerJira().subscribe(
        (issues: ReleaseWithAlm[]) => {
            if (issues.length == 0 ) {
            this.statusRelease = 'no data';
          } else {

             if (actionInput.value === 'release' && issues.length > 0 ) {
              this.statusRelease = 'pulling';
              this.issuesRelease = issues;
              this.UsTraceabilityService.getTraceabilitAySprint_calc2(this.issuesRelease);

              issues.forEach(issue => {
                var issueWithALM:IssuesByProject =  {'csi':issue.fields.customfield_10602,'totalA':0,'totalZ':0,'key':issue.key};
                if(projectAlm.length != 0){
                  var indexALM = projectAlm.findIndex((x) => x.key === issue.key);
                }else{
                  var indexALM = -1;
                }

                 if(indexALM != -1){
                        issueWithALM.totalA = projectAlm[indexALM].total
                        this.issuesTotalReleaseWithAlm.push(issueWithALM);
                }else{
                  this.issuesTotalReleaseWithAlm.push(issueWithALM);
                }
              });

              this.TraceabilitySprint_calcSub = this.UsTraceabilityService.getTraceabilitySprintUpdatedListenerJira().subscribe(
                (data) => {
                 if (actionInput.value === 'release') {
                        var totalAZ:number = 0;
                        var total:number = 0;
                        data.Report.forEach(element => {
                         total = total + 1;
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
          }
        });
    }
  }

  ngOnDestroy() {
  }
}
