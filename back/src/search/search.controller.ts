import { Body, Controller, UseGuards, Delete, Get, Param, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController
{
    constructor(private readonly searchService : SearchService){}

    @Get()
    getAll()
    {
        return this.searchService.getAll();
    }

    @Get('searchedUsers/:userId')
    getSearchedUsers(@Param() body)
    {
        return this.searchService.getSearchedUsers(+body?.userId);
    }

    @Get(':name/:userId')
    filterSearch(@Param() body)
    {
        return this.searchService.filterSearch(body?.name, +body?.userId);
    }

    @Post()
    addSearch(@Body() body)
    {
        return this.searchService.addSearch(+body?.userId, +body?.searchingUserId);
    }

    @Delete(':id')
    deleteSearch(@Param() body)
    {
        return this.searchService.deleteSearch(+body?.id);
    }
}
