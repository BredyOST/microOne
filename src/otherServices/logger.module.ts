import { Module, Provider } from '@nestjs/common'
import { LogsService } from './logger.service'
import { LogsController } from './logger.controller'

export const RepositoryNameTokenPostsAdd = 'RepositoryNameTokenPostsAdd'
export const RepositoryNameOthersAdd = 'RepositoryNameOthers'
export const RepositoryPostsAdd: Provider = {
    provide: RepositoryNameTokenPostsAdd,
    useValue: `PostsAdd`,
}

export const RepositoryOthersAdd: Provider = {
    provide: RepositoryNameOthersAdd,
    useValue: `OthersAdd`,
}

@Module({
    controllers: [LogsController],
    providers: [LogsService, RepositoryPostsAdd, RepositoryOthersAdd],
    exports: [LogsService],
})
export class LogsModule {}
