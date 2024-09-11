import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticService } from './statistic.service';
import { UserBookignCount } from './vo/UserBookignCount.vo';
import { MeetingRoomUsedCount } from './vo/MeetingRoomUsedCount.vo';

@ApiTags('Statistics Module')
@Controller('statistic')
export class StatisticController {
  @Inject(StatisticService)
  private statisticService: StatisticService;

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: 'Start time',
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: 'End time',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBookignCount,
  })
  @Get('userBookingCount')
  async userBookignCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime,
  ) {
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: 'Start time',
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: 'End time',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MeetingRoomUsedCount,
  })
  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime,
  ) {
    return this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
