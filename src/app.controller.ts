import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Logger,
  ParseFilePipeBuilder,
  Post,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { User } from './modules/users/entities/user.entity';
import { UsersService } from './modules/users/users.service';
import { Role } from './enums/role.enum';
import { Roles } from './decorators/role.decorator';
import { CheckPolicies } from './decorators/check-policies.decorator';
import { AppAbility } from './modules/casl/casl-ability.factory';
import { Action } from './enums/action.enum';
import { Article } from './modules/articles/entities/article.entity';
import { PoliciesGuard } from './guards/policies/policies.guard';
import { ReadArticlePolicyHandler } from './handlers/read-article-policy.handler';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  @UseFilters(new HttpExceptionFilter())
  @Get()
  getHello() {
    return this.appService.getDatabaseConfig();
  }

  @Roles(Role.ADMIN)
  @Get('cookie')
  findAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log(req.cookies);

    res.cookie('key', 'value').send('Cookie has been set');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({ maxSize: 1000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadArticlePolicyHandler())
  @Get('file')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getFile(@Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    file.pipe(res);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Article))
  @Get('axios')
  async findAlUsers(): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<User[]>('http://localhost:3333/users').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
