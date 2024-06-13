import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Roles } from 'src/auth/decorators/user.decorator';
import { RolesGuard } from 'src/roles-guard.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { ErrorHanldingFn } from 'src/utils/utils.helper';
import { pagination } from 'src/utils/utils.types';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { IReqBodyToCreateSTask } from './interfaces/task.interface';

@Controller({ path: '/api/v1/tasks' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getAllTasks(@GetUser() user: IUser, @Query() query: pagination) {
    try {
      const rs = await this.tasksService.getAllTasks(user, query);
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Get('/admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getAllTasksForAdmin(@Query() query: pagination) {
    try {
      const rs = await this.tasksService.getAllTasksForAdmin(query);
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/update')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async updateTask(
    @GetUser() user: IUser,
    @Body('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const rs = await this.tasksService.updateTask(
        user,
        taskId,
        updateTaskDto,
      );
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/update-active')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async updateTaskActiveStatus(
    @GetUser() user: IUser,
    @Body('taskId') taskId: string,
  ) {
    try {
      const rs = await this.tasksService.updateTaskActiveStatus(user, taskId);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/create-comment')
  @UseGuards(AuthGuard(), RolesGuard)
  // @Roles('admin', 'broker')
  async createComment(
    @GetUser() user: IUser,
    @Body('taskId') taskId: string,
    @Body('comment') comment: string,
  ) {
    try {
      const rs = await this.tasksService.createComment(user, taskId, comment);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/update-comment')
  @UseGuards(AuthGuard(), RolesGuard)
  // @Roles('admin', 'broker')
  async updateComment(
    @GetUser() user: IUser,
    @Body('taskId') taskId: string,
    @Body('commentId') commentId: string,
    @Body('comment') comment: string,
  ) {
    try {
      const rs = await this.tasksService.updateComment(
        user,
        taskId,
        commentId,
        comment,
      );
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/delete-comment')
  @UseGuards(AuthGuard(), RolesGuard)
  // @Roles('admin', 'broker')
  async deleteComment(
    @GetUser() user: IUser,
    @Body('taskId') taskId: string,
    @Body('commentId') commentId: string,
  ) {
    try {
      const rs = await this.tasksService.deleteComment(user, taskId, commentId);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  // @Delete('/delete/:taskId')
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Roles('admin')
  // async deleteTask(@GetUser() user: IUser, @Param('taskId') taskId: string) {
  //   try {
  //     const rs = await this.tasksService.deleteTask(user, taskId);
  //     return rs;
  //   } catch (error) {
  //     throw ErrorHanldingFn(error);
  //   }
  // }

  @Post('/s-create-task-status')
  async sCreateTaskStatus(@Body('name') name: string) {
    try {
      const res = await this.tasksService.sCreateTaskStatus(name);
      return res;
    } catch (err) {
      throw ErrorHanldingFn(err);
    }
  }

  @Post('/s-create-task')
  async sCreateTask(@Body() reqBody: IReqBodyToCreateSTask) {
    try {
      const res = await this.tasksService.sCreateTask(reqBody);
      return res;
    } catch (err) {
      throw ErrorHanldingFn(err);
    }
  }

  @Get('/s-get-all-task-statuses')
  async sGetAllTaskStatuses() {
    try {
      const res = await this.tasksService.sGetAllTaskStatuses();
      return res;
    } catch (err) {
      throw ErrorHanldingFn(err);
    }
  }
}
