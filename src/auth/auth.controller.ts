import { Controller, Post, Body, UseGuards, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from 'src/dtos/auth.dto';
import { CreateUserDto, LoginDto } from 'src/dtos/user.dto';
import { UserResponseDto } from 'src/dtos/response/user.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập hệ thống',
    description: 'Đăng nhập bằng email và mật khẩu để nhận JWT token'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      userLogin: {
        summary: 'Đăng nhập user thường',
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      },
      adminLogin: {
        summary: 'Đăng nhập admin',
        value: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công',
    type: TokenResponseDto,
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          expiresIn: 86400
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Thông tin đăng nhập không chính xác',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Email hoặc mật khẩu không chính xác',
          error: 'Unauthorized'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['Email không hợp lệ', 'Mật khẩu phải có ít nhất 6 ký tự'],
          error: 'Bad Request'
        }
      }
    }
  })
  async login(@Body() loginDto: { email: string; password: string }): Promise<TokenResponseDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.login(user);
    return {
      accessToken: token,
      expiresIn: 24 * 60 * 60
    }
  }

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description: 'Đăng ký tài khoản mới với vai trò mặc định là USER'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin đăng ký',
    examples: {
      example1: {
        summary: 'Đăng ký user mới',
        value: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          password: 'password123',
          phone: '0123456789',
          address: 'Hà Nội',
          membershipExpiry: '2025-03-12'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký thành công',
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789',
          role: 'user',
          status: 'active',
          membershipExpiry: '2025-03-12T00:00:00.000Z',
          createdAt: '2024-03-12T08:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email đã tồn tại hoặc dữ liệu không hợp lệ',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Email đã được sử dụng',
          error: 'Bad Request'
        }
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Làm mới access token',
    description: 'Sử dụng refresh token để lấy access token mới'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Làm mới token thành công',
    type: TokenResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token không hợp lệ hoặc đã hết hạn'
  })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<TokenResponseDto> {
    const token = await this.authService.refresh(refreshToken);
    return {
      accessToken: token,
      expiresIn: 24 * 60 * 60
    }
  }
}