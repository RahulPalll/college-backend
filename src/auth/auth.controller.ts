import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles/roles.guard';
import { Role } from './roles.enum';
import { Roles } from './roles/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'The username of the user' },
        password: { type: 'string', description: 'The password of the user' },
      },
      required: ['username', 'password'],
    },
  })
  async signup(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(username, password);
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'The username of the user' },
        password: { type: 'string', description: 'The password of the user' },
      },
      required: ['username', 'password'],
    },
  })
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('add-role')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description:
            'The username of the user to whom the role will be assigned',
        },
        role: {
          type: 'string',
          description: 'The role to assign (e.g., admin, user, manager)',
          enum: Object.values(Role),
        },
      },
      required: ['username', 'role'],
    },
  })
  async addRole(@Body('username') username: string, @Body('role') role: Role) {
    return this.authService.addRole(username, role);
  }
}
