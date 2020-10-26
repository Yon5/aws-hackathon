import { SubtaskAlm } from 'src/app/models/subtaskAlm';
export class ReleaseWithAlm {
  expand: string;
  self: string;
  id:string;
  key:string;
  fields:{customfield_10602:string,subtasks:SubtaskAlm[]};
}
