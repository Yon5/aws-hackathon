import { Injectable } from '@angular/core';
import { Release } from '../models/release';
import { Issues } from '../models/issues';
import { IssueCSI } from 'src/app/models/issue-csi';
import { ReportBySprint } from '../models/report-by-sprint';
import { AllProjectIssues } from '../models/all-project-issues';
import { AllProjectTraceability } from '../models/all-project-traceability';
import { AllProjectTraceabilityTotal } from '../models/all-project-traceability-total';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ReleaseWithAlm } from '../models/releaseWithAlm';

@Injectable({
  providedIn: 'root',
})
export class UsTraceabilityService {
  private allProjectTraceabilityVar: AllProjectTraceability = {
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
  private allIssuesProjects: AllProjectIssues[] = [];
  private issues: ReportBySprint = { Report: [], traceability: 0 };
  private release: Release[] = [];
  private releaseJ: Release[] = [];
  private releaseJWithAlm: ReleaseWithAlm[] = [];
  private releaseUpdated = new Subject<Release[]>();
  private TraceabilitySprintUpdated = new Subject<ReportBySprint>();
  private TraceabilitySprintAlmUpdated = new Subject<ReportBySprint>();
  private ReportUpdatedTotal = new Subject<AllProjectTraceabilityTotal>();
  private allIssuesProjectsUpdated = new Subject<AllProjectIssues[]>();
  private allIssuesProjectsAlmUpdated = new Subject<
    AllProjectTraceabilityTotal
  >();
  private getAllProjectsTraceabilityByReleaseTraceabilityUpdated = new Subject<
    AllProjectTraceability
  >();

  constructor(private http: HttpClient) {}
  // getReleaseByProject(p_id) {
  //   this.http
  //     .get<{ message: string; release: Release[] }>(
  //       'http://localhost:3000/api/v1.0/getRProjectZ/?endPointZ=getRProjectZ&component=zephyr&p_id=' +
  //         p_id
  //     )
  //     .subscribe(
  //       (projectReleaseData) => {
  //         this.release = projectReleaseData.release;
  //         this.releaseUpdated.next([...this.release]);
  //       },
  //       (error: Response) => {
  //         if (error.status === 404) alert('This  action is not defined');
  //         else
  //           alert(
  //             'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
  //           );
  //         window.open('https://sd-puyd-2aql:3000', '_blank');
  //       }
  //     );
  // }
  getReleaseUpdateListener() {
    return this.releaseUpdated.asObservable();
  }

  getReleaseByProjectJira(sprint, project, action) {
    this.http
      .get<{ message: string; size: number; release: Release[] }>(
        'https://sd-puyd-2aql:3000/api/v1.0/getTbySprint/?component=jira&endPointJ=getIssueBySpringProject&sprintJ=' +
          sprint +
          '&projectJ=' +
          project +
          '&actionJ=' +
          action
      )
      .subscribe(
        (projectReleaseData) => {
          this.releaseJ = projectReleaseData.release;
          this.getTraceabilitySprintUpdatedListenerJira();

          this.releaseUpdated.next([...this.releaseJ]);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }

  getReleaseByProjectJiraAndAlm(sprint, project, action) {
    this.http
      .get<{ message: string; size: number; release: Release[] }>(
        'https://sd-puyd-2aql:3000/api/v1.0/getTbySprintAlm/?component=jira&endPointJ=getIssueBySpringProject&sprintJ=' +
          sprint +
          '&projectJ=' +
          project +
          '&actionJ=' +
          action
      )
      .subscribe(
        (projectReleaseData) => {
          this.releaseJ = projectReleaseData.release;
          this.getTraceabilitySprintAlmUpdatedListenerJira();

          this.releaseUpdated.next([...this.releaseJ]);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          if (error.status === 0) {
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
            window.open('https://sd-puyd-2aql:3000', '_blank');
          } else {
            window.open('something went wrong try again');
          }
        }
      );
  }
  getReleaseByProjectJiraAndAlmSprint(sprint, project, action) {
    this.http
      .get<{ message: string; size: number; release: Release[] }>(
        'https://sd-puyd-2aql:3000/api/v1.0/getTbySprintAlmSprint/?component=jira&endPointJ=getIssueBySpringProject&sprintJ=' +
          sprint +
          '&projectJ=' +
          project +
          '&actionJ=' +
          action
      )
      .subscribe(
        (projectReleaseData) => {
          this.releaseJ = projectReleaseData.release;
          this.getTraceabilitySprintAlmUpdatedListenerJira();

          this.releaseUpdated.next([...this.releaseJ]);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          if (error.status === 0) {
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
            window.open('https://sd-puyd-2aql:3000', '_blank');
          } else {
            window.open('something went wrong try again');
          }
        }
      );
  }

  getReleaseByProjectAlm(sprint, project, action) {
    this.http
      .get<{ message: string; size: number; release: ReleaseWithAlm[] }>(
        'https://sd-puyd-2aql:3000/api/v1.0/getTbySprint/?component=jira&endPointJ=getIssueBySpringProject&sprintJ=' +
          sprint +
          '&projectJ=' +
          project +
          '&actionJ=' +
          action
      )
      .subscribe(
        (projectReleaseData) => {
          this.releaseJWithAlm = projectReleaseData.release;
          this.getTraceabilitySprintUpdatedListenerJira();

          this.releaseUpdated.next([...this.releaseJWithAlm]);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }

  getTraceabilitAySprint_calc2(issuesTickets: Release[]) {
    var issue: Issues = { key: '', csi: '', total: 0 };
    var issueArray: Issues[] = [];
    var issuesArray = [];

    issuesTickets.forEach((element) => {
      issuesArray.push(element.key.toString());
      issue.key = element.key;
      issue.csi = element.fields.customfield_10602;
      issueArray.push(issue);
      issue = { key: '', csi: '', total: 0 };
    });
    let urlV =
      'https://sd-puyd-2aql:3000/api/v1.0/getTraceabilitySprint/?issues=' +
      JSON.stringify(issuesArray);
    this.http
      .get<{ message: string; TraceabilitySprint: number; release: Issues[] }>(
        urlV
      )
      .subscribe(
        (data) => {
          this.issues.traceability = data.TraceabilitySprint;
          this.issues.Report = data.release;
          this.issues.Report = issueArray.map((x) =>
            Object.assign(
              x,
              this.issues.Report.find((y) => y.key == x.key)
            )
          );
          this.TraceabilitySprintUpdated.next(this.issues);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }

  getReport(release: string) {
    let urlV = 'https://sd-puyd-2aql:3000/api/v1.0/getReportRelease';

    this.http
      .post<{
        report: AllProjectTraceability[];
        traceability: string;
        date: string;
      }>(urlV, { release: release })
      .subscribe(
        (ResponseData) => {
          this.ReportUpdatedTotal.next(ResponseData);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }
  getReportUpdateListener() {
    return this.ReportUpdatedTotal.asObservable();
  }

  getAllProjects(release) {
    let urlV =
      'https://sd-puyd-2aql:3000/api/v1.0/getJProjects/?release="' +
      release +
      '"';
    this.http
      .get<{ message: string; release: AllProjectIssues[] }>(urlV)
      .subscribe(
        (data) => {
          this.allIssuesProjects = data.release;
          this.allIssuesProjectsUpdated.next([...this.allIssuesProjects]);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }
  getAllProjectsUpdateListener() {
    return this.allIssuesProjectsUpdated.asObservable();
  }
  //ALM

  getAllProjectsAlm(release: string) {
    let urlV =
      'https://sd-puyd-2aql:3000/api/v1.0/getALMReport/?release="' +
      release +
      '"';
    this.http
      .get<{
        report: AllProjectTraceability[];
        traceability: string;
        date: string;
      }>(urlV)
      .subscribe(
        (data) => {
          this.allIssuesProjectsAlmUpdated.next(data);
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }
  getAllProjectsAlmUpdateListener() {
    return this.allIssuesProjectsAlmUpdated.asObservable();
  }
  getAllProjectsTraceabilityByRelease(
    issuesTickets: IssueCSI[],
    project: String
  ) {
    let issues = '';
    var issuesArray: string[] = [];
    issuesTickets.forEach((element) => {
      issuesArray.push(element.key);
    });
    let urlV =
      'https://sd-puyd-2aql:3000/api/v1.0/getJAllProjectsTraceability/?issues=' +
      JSON.stringify(issuesArray) +
      '&project=' +
      project;
    this.http
      .get<{
        message: string;
        TraceabilitySprint: number;
        project: string;
        issues: String[];
        release: Issues[];
      }>(urlV)
      .subscribe(
        (data) => {
          this.allProjectTraceabilityVar.traceability = data.TraceabilitySprint;
          this.allProjectTraceabilityVar.Issues = data.issues;
          this.allProjectTraceabilityVar.project = data.project;
          this.allProjectTraceabilityVar.release = issuesTickets.map((x) =>
            Object.assign(
              x,
              data.release.find((y) => y.key == x.key)
            )
          );
          this.getAllProjectsTraceabilityByReleaseTraceabilityUpdated.next(
            this.allProjectTraceabilityVar
          );
        },
        (error: Response) => {
          if (error.status === 404) alert('This  action is not defined');
          else
            alert(
              'For security, the application is installed on HTTPS protocol:  Click on Advanced -> Proceed to sd-puyd-2aql'
            );
          window.open('https://sd-puyd-2aql:3000', '_blank');
        }
      );
  }
  getAllProjectsTraceabilityByReleaseListernerJira() {
    return this.getAllProjectsTraceabilityByReleaseTraceabilityUpdated.asObservable();
  }

  getTraceabilitySprintUpdatedListenerJira() {
    return this.TraceabilitySprintUpdated.asObservable();
  }
  getTraceabilitySprintAlmUpdatedListenerJira() {
    return this.TraceabilitySprintAlmUpdated.asObservable();
  }
  getReleaseUpdateListenerJira() {
    return this.releaseUpdated.asObservable();
  }
}
