import { ApiTags } from '@nestjs/swagger/dist';
import { Controller } from '@nestjs/common';

@ApiTags('jira')
@Controller({ path: 'jira' })
export class JiraController {}
