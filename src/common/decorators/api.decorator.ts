import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse
} from '@nestjs/swagger';
import { Get, Post, applyDecorators } from '@nestjs/common';

const createApiResponse = (status: number, description: string) =>
  ApiResponse({ status, description });

const addCommonDecorators = (endpointConfig: any) => {
  const decorators = [
    createApiResponse(200, endpointConfig.success || 'Success.'),
    createApiResponse(400, endpointConfig.err || 'None'),
    createApiResponse(401, 'Unauthorized.'),
    createApiResponse(409, endpointConfig.conflict || 'None'),
    createApiResponse(500, 'Internal Server Error.'),
    ApiOperation({ summary: endpointConfig.title })
  ];

  if (endpointConfig.query) decorators.push(ApiQuery(endpointConfig.query));
  if (endpointConfig.param) decorators.push(ApiParam(endpointConfig.param));
  if (endpointConfig.body)
    decorators.push(ApiBody({ type: endpointConfig.body }));

  return decorators;
};

export const ApiEndpoint = (endpointConfig: any) => {
  const decorators = addCommonDecorators(endpointConfig);

  if (endpointConfig.method === 'POST') decorators.push(Post());
  else if (endpointConfig.method === 'GET') decorators.push(Get());

  return applyDecorators(...decorators);
};

export const ApiEndpointAuth = (endpointConfig: any) => {
  const decorators = addCommonDecorators(endpointConfig);

  decorators.unshift(ApiBearerAuth('access-token'));
  decorators.push(createApiResponse(401, 'Unauthorized.'));

  if (endpointConfig.method === 'POST') decorators.push(Post());
  else if (endpointConfig.method === 'GET') decorators.push(Get());

  return applyDecorators(...decorators);
};
