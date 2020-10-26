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
import { Subscription } from 'rxjs';
import { Issues } from 'src/app/models/issues';
import { Projects } from 'src/app/models/projects';
import { Release } from 'src/app/models/release';
import { Report } from 'src/app/models/report.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-entire-release-all',
  templateUrl: './entire-release-all.component.html',
  styleUrls: ['./entire-release-all.component.css']
})
export class EntireReleaseAllComponent implements OnInit, OnDestroy {
  dateAlmReport: string = '';
  kindOfReport: string = '';
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
  dateReportAlm: string = '';
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
  release: Release[] = [];
  issues: Release[] = [];
  issuesRelease: Release[] = [];
  SizeStories: number = null;
  issuesTotal: Issues[] = [];
  TraceabilitySprint_calc: number;
  issuesTotalRelease: Issues[] = [];
  TraceabilitySprint_calcRelease: number;
  TraceabilitySprint: Issues[] = [];
  reportTraceabilityZephyr: string = '';
  reportTraceabilityZephyrRequirementsWithTest: number = 0;
  reportTraceabilityZephyrTotalRequirements: number = 0;
  reportTraceabilityAlm: string = '';
  reportTraceabilityAlmRequirementsWithTest: number = 0;
  reportTraceabilityAlmTotalRequirements: number = 0;
  almFilter:number = 1;
  private AllProjectsTraceabilityByReleaseTraceabilitySub: Subscription;
  private getSaveReportUpdateListenerSub: Subscription;
  private getReportUpdateListenerSub: Subscription;
  dataTable: any;
  dataTableAlm: any;
  $: any;



 formAll = new FormGroup({
    releaseAll: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
      Validators.pattern(/[0-9]{4}[/.]{1}[0-9]{2}/),
      FormsValidators.cannotContainSpace,
    ]),
  });


  constructor(public UsTraceabilityService: UsTraceabilityService) {};
  // exportPDF(x: number){
  //   $().DataTable().buttons(0,x).trigger();
  // }


  onClinkAll(releaseInput: HTMLInputElement) {
    (<any> $('#dataTable')).dataTable().fnClearTable();
    this.kindOfReport = "merged";
    var d = new Date();
    var hr = d.getHours();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var monthS:string='';

    this.allProjects = [];
     if(month < 10 ){
      monthS =  '0'+ month;
     }else{
      monthS = ''+month
     }
    this.report.generated =  year + '/' + monthS + '/'+date;
    this.report.release = releaseInput.value;
    this.statusRelease = '';
    this.statusSprint = '';
    this.statusAllProjects = '';
    this.issues = [];
    this.issuesRelease = [];
    this.issuesTotalRelease = [];
    try{
    this.UsTraceabilityService.getReport(releaseInput.value);
    }catch(e) {alert("Error")}

    this.allProjects = [];
    if (!this.getReportUpdateListenerSub) {
      this.getReportUpdateListenerSub = this.UsTraceabilityService.getReportUpdateListener().subscribe(
        (report: AllProjectTraceabilityTotal) => {
          if (report.report.length <= 0) {
          } else {
            this.statusAllProjects =
              'Projects were found. Starting the data extraction.';
            this.UsTraceabilityService.getAllProjectsAlm(releaseInput.value);
            this.UsTraceabilityService.getAllProjectsAlmUpdateListener().subscribe(
              (almReport: AllProjectTraceabilityTotal) => {
                this.allProjectsAlm = almReport.report;
                this.dateReportAlm = almReport.date;
                if (this.allProjectsAlm.length == 0) {
                  this.reportTraceabilityAlm = 'N/A';
                  this.allProjects = report.report;

                  this.allProjects.forEach((project) => {
                    if (project.report === undefined) {
                      project.report = 'ZEPHYR';
                    }
                    if (project.IssuesZeroTestA === undefined) {
                      project.IssuesZeroTestA = [];
                    }
                    if (project.IssuesZeroTestAALM === undefined) {
                      project.IssuesZeroTestAALM = [];
                    }
                    if (project.IssuesWithTestA === undefined) {
                      project.IssuesWithTestA = [];
                    }
                    if (project.IssuesWithTestAALM === undefined) {
                      project.IssuesWithTestAALM = [];
                    }
                    if (project.IssuesZeroTestA.length > 0) {
                      project.IssuesUnknownSource = project.IssuesZeroTestA;
                      project.IssuesZeroTestA = [];
                    }
                    this.reportTraceabilityZephyrRequirementsWithTest =
                      this.reportTraceabilityZephyrRequirementsWithTest +
                      project.IssuesWithTestA.length;
                    this.reportTraceabilityZephyrTotalRequirements =
                      this.reportTraceabilityZephyrTotalRequirements +
                      (project.IssuesWithTestA.length +
                        project.IssuesZeroTestA.length);
                    this.reportTraceabilityAlmRequirementsWithTest =
                      this.reportTraceabilityAlmRequirementsWithTest +
                      project.IssuesWithTestAALM.length;
                    this.reportTraceabilityAlmTotalRequirements =
                      this.reportTraceabilityAlmTotalRequirements +
                      (project.IssuesWithTestAALM.length +
                        project.IssuesZeroTestAALM.length);
                    this.overallIssuesWithOutTest =
                      this.overallIssuesWithOutTest +
                      project.IssuesZeroTestA.length +
                      project.IssuesZeroTestAALM.length;
                    this.overallIssuesWithTest =
                      this.overallIssuesWithTest +
                      project.IssuesWithTestA.length +
                      project.IssuesWithTestAALM.length;
                  });
                  this.mergeProjects = [];
                  this.TotalProjectsByRelease = this.allProjects.length;
                  this.dateReport = report.date;
                  this.reportTraceability = (
                    (this.overallIssuesWithTest /
                      (this.overallIssuesWithOutTest +
                        this.overallIssuesWithTest)) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.reportTraceabilityZephyr = (
                    (this.reportTraceabilityZephyrRequirementsWithTest /
                      this.reportTraceabilityZephyrTotalRequirements) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.reportTraceabilityAlm = (
                    (this.reportTraceabilityAlmRequirementsWithTest /
                      this.reportTraceabilityAlmTotalRequirements) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.overallIssuesWithOutTest = 0;
                  this.overallIssuesWithTest = 0;
                  this.reportTraceabilityZephyrRequirementsWithTest = 0;
                  this.reportTraceabilityZephyrTotalRequirements = 0;
                  this.reportTraceabilityAlmRequirementsWithTest = 0;
                  this.reportTraceabilityAlmTotalRequirements = 0;
                } else {
                  this.allProjects = [];
                  this.dateReport = report.date;
                  this.allProjects = report.report;
                  this.allProjectsAlm.forEach((element) => {
                    element.IssuesUnknownSource = [];
                    var index = this.allProjects.findIndex((x) => x.project === element.project);
                    if (index != -1) {
                      //get a copy of that row from zephyr projects
                      var row: AllProjectTraceability = this.allProjects[index];
                      row.IssuesUnknownSource = [];
                      this.allProjects[index].IssuesZeroTestA.forEach(
                        (issue) => {
                            var index = element.IssuesZeroTestAALM.findIndex(
                            (x) => x.key === issue.key
                          );
                          if (index === -1) {
                            row.IssuesUnknownSource.push(issue);

                          }
                        }
                      );
                      element.IssuesZeroTestAALM.forEach((issuesZeroTestALM) => {

                        var indexIssueALM = row.IssuesZeroTestA.findIndex(
                          (x) => x.key === issuesZeroTestALM.key
                        );
                        var indexIssue2ALM = row.IssuesWithTestAALM.findIndex(
                          (x) => x.key === issuesZeroTestALM.key
                        );
                        var indexIssue3ALM = row.IssuesWithTestA.findIndex(
                          (x) => x.key === issuesZeroTestALM.key
                        );
                        var indexIssue4ALM = row.IssuesZeroTestAALM.findIndex(
                          (x) => x.key === issuesZeroTestALM.key
                        );
                        if ( indexIssue2ALM === -1 && indexIssue3ALM === -1 && indexIssue4ALM === -1) {
                          row.IssuesZeroTestAALM.push(issuesZeroTestALM);

                          }

                        });

                      //Remuving deplicates
                      element.IssuesWithTestAALM.forEach(issuesWithTestALM => {
                        var indexIssue = row.IssuesWithTestAALM.findIndex(
                          (x) => x.key === issuesWithTestALM.key
                        );
                        if (indexIssue == -1) {
                          // row.IssuesZeroTestA.splice(indexIssue, 1);
                          row.IssuesWithTestAALM.push(issuesWithTestALM)
                        }
                      });
                      //row.IssuesWithTestAALM = element.IssuesWithTestAALM;
                      this.allProjects[index].IssuesZeroTestA = [];
                      row.IssuesWithTestAALM.forEach((issuesWithTestALM) => {
                        var indexIssue = row.IssuesZeroTestA.findIndex(
                          (x) => x.key === issuesWithTestALM.key
                        );
                        var indexIssue2 = row.IssuesZeroTestAALM.findIndex(
                          (x) => x.key === issuesWithTestALM.key
                        );
                        var indexIssue3 = row.IssuesUnknownSource.findIndex(
                          (x) => x.key === issuesWithTestALM.key
                        );

                         if (indexIssue != -1) {
                          row.IssuesZeroTestA.splice(indexIssue, 1);
                        }
                        if (indexIssue2 != -1) {
                          row.IssuesZeroTestAALM.splice(indexIssue2, 1);
                        }
                        if (indexIssue3 != -1) {
                          row.IssuesUnknownSource.splice(indexIssue3, 1);
                        }
                      });

                      if (row.IssuesZeroTestAALM === undefined) {
                        row.IssuesZeroTestAALM = [];
                      }
                      row.report = 'MERGE';
                      if (
                        this.allProjects[index].IssuesZeroTestA.length > 0 &&
                        row.IssuesWithTestAALM.length == 0 &&
                        row.IssuesZeroTestAALM.length == 0
                      ) {
                        this.allProjects.splice(index, 1);
                      } else {
                        row.totalIssues =
                          row.IssuesWithTestA.length +
                          row.IssuesWithTestAALM.length +
                          row.IssuesZeroTestA.length +
                          row.IssuesZeroTestAALM.length +
                          row.IssuesUnknownSource.length;
                        row.traceability =
                          100 *
                          ((row.IssuesWithTestA.length +
                            row.IssuesWithTestAALM.length) /
                            (row.IssuesWithTestA.length +
                              row.IssuesWithTestAALM.length +
                              row.IssuesZeroTestAALM.length +
                              row.IssuesZeroTestA.length +
                              row.IssuesUnknownSource.length));
                        this.mergeProjects.push(row);
                        this.allProjects.splice(index, 1);
                      }
                    } else {

                      this.mergeProjects.push(element);
                    }
                  });

                  this.allProjects = this.mergeProjects.concat(
                    this.allProjects
                  );
                  this.allProjects.forEach((project) => {
                    if (project.report === undefined) {
                      project.report = 'ZEPHYR';
                    }
                    if (project.IssuesZeroTestA === undefined) {
                      project.IssuesZeroTestA = [];
                    }
                    if (project.IssuesZeroTestAALM === undefined) {
                      project.IssuesZeroTestAALM = [];
                    }
                    if (project.IssuesWithTestA === undefined) {
                      project.IssuesWithTestA = [];
                    }
                    if (project.IssuesWithTestAALM === undefined) {
                      project.IssuesWithTestAALM = [];
                    }
                    if (project.IssuesZeroTestA.length > 0) {
                      project.IssuesUnknownSource = project.IssuesZeroTestA;
                      project.IssuesZeroTestA = [];
                    }
                    this.reportTraceabilityZephyrRequirementsWithTest =
                      this.reportTraceabilityZephyrRequirementsWithTest +
                      project.IssuesWithTestA.length;
                    this.reportTraceabilityZephyrTotalRequirements =
                      this.reportTraceabilityZephyrTotalRequirements +
                      (project.IssuesWithTestA.length +
                        project.IssuesZeroTestA.length);

                    //Alm
                    this.reportTraceabilityAlmRequirementsWithTest =
                      this.reportTraceabilityAlmRequirementsWithTest +
                      project.IssuesWithTestAALM.length;
                    this.reportTraceabilityAlmTotalRequirements =
                      this.reportTraceabilityAlmTotalRequirements +
                      (project.IssuesWithTestAALM.length +
                        project.IssuesZeroTestAALM.length);

                    this.overallIssuesWithOutTest =
                      this.overallIssuesWithOutTest +
                      project.IssuesZeroTestA.length +
                      project.IssuesZeroTestAALM.length;
                    this.overallIssuesWithTest =
                      this.overallIssuesWithTest +
                      project.IssuesWithTestA.length +
                      project.IssuesWithTestAALM.length;
                  });
                  this.mergeProjects = [];
                  this.TotalProjectsByRelease = this.allProjects.length;
                  this.reportTraceability = (
                    (this.overallIssuesWithTest /
                      (this.overallIssuesWithOutTest +
                        this.overallIssuesWithTest)) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.reportTraceabilityZephyr = (
                    (this.reportTraceabilityZephyrRequirementsWithTest /
                      this.reportTraceabilityZephyrTotalRequirements) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.reportTraceabilityAlm = (
                    (this.reportTraceabilityAlmRequirementsWithTest /
                      this.reportTraceabilityAlmTotalRequirements) *
                    100
                  )
                    .toFixed(0)
                    .toString();
                  this.overallIssuesWithOutTest = 0;
                  this.overallIssuesWithTest = 0;
                  this.reportTraceabilityZephyrRequirementsWithTest = 0;
                  this.reportTraceabilityZephyrTotalRequirements = 0;
                  this.reportTraceabilityAlmRequirementsWithTest = 0;
                  this.reportTraceabilityAlmTotalRequirements = 0;
                }
              }
            );
          }
        }
      );
    }
  } //End

  @ViewChild('dataTable', { read: ElementRef }) table: ElementRef;
  @ViewChild('dataTable', { read: ElementRef }) tableAlm: ElementRef;
  ngAfterViewChecked() {
    if (this.table != undefined && !$.fn.dataTable.isDataTable(this.table.nativeElement)){
      this.dataTable = $(this.table.nativeElement);
      $.fn.dataTable.ext.search = [
        function( settings, data, dataIndex ) {
          if($('#min').val() >= 0  && $('#max').val() > 0 ){
            var min = parseInt( $('#min').val() as string );
            var max = parseInt( $('#max').val() as string );
            var age = parseFloat( data[3] ) || 0; // use data for the age column
            if ( ( isNaN( min ) && isNaN( max ) ) ||
                ( isNaN( min ) && age <= max ) ||
                ( min <= age   && isNaN( max ) ) ||
                ( min <= age   && age <= max ) )
            {
                return true;
            }
            return false;
        }}
      ];
      this.dataTable.DataTable({
        "searching": true,
        "select": true,
        "retrieve": true,
        "autoWidth":false,
        "info":false,
        "JQueryUI":true,
        "ordering":true,
        "paging":true,
        "scrollY":"300px",
        "scrollCollapse":true,
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'pdf', {
          text: 'Traceability < 100%',
          action: function ( e, dt, node, config ) {
            if($('#min').val() >= 0  && $('#max').val() > 0 ){
              $('#min').val('0');
              $('#max').val('99');
              $('#dataTable').DataTable().draw();
              $("button.dt-button.active").removeClass('active');
              $(node).addClass('active');
            }else{
              alert( 'Min  & Max value are required' );
            }
          }
      },
      {
        text: 'Traceability = 100%',
        action: function ( e, dt, node, config ) {
          if($('#min').val() >= 0  && $('#max').val() > 0 ){
            $('#min').val('100');
            $('#max').val('100');
            $('#dataTable').DataTable().draw();
            $("button.dt-button.active").removeClass('active');
            $(node).addClass('active');
          }else{
            alert( 'Min  & Max value are required' );
          }
        }
    },
    {
      text: 'Complete Traceability',
      className: 'active',
      action: function ( e, dt, node, config ) {
        if($('#min').val() >= 0  && $('#max').val() > 0 ){
          $('#min').val('0');
          $('#max').val('100');
          $('#dataTable').DataTable().draw();
          $("button.dt-button.active").removeClass('active');
          $(node).addClass('active');
        }else{
          alert( 'Min  & Max value are required' );
        }
      }
    }


  ],
      });
    }





  }

  ngOnInit(): void {

  }
  ngOnDestroy() {
  }

}
