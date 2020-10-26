import { Issues } from './issues';
import  { IssueCSI }  from './issue-csi';

export class AllProjectTraceability {

  project:String;
  report:string;
  totalIssues:number;
  traceability:number;
  Issues:String[];
  traceabilityAll:string;
  release:Issues[];
  IssuesZeroTest:string;
  IssuesWithTest:string;
  IssuesZeroTestA:IssueCSI[];
  IssuesZeroTestAALM:IssueCSI[];
  IssuesWithTestA:IssueCSI[];
  IssuesWithTestAALM:IssueCSI[];
  IssuesUnknownSource:IssueCSI[];




}
