> ## Documentation Index
> Fetch the complete documentation index at: https://docs.dify.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# 从文件创建文档

> 通过上传文件在现有知识库中创建新文档。



## OpenAPI

````yaml zh/api-reference/openapi_knowledge.json post /datasets/{dataset_id}/document/create-by-file
openapi: 3.0.1
info:
  title: 知识库 API
  description: 用于管理知识库（数据集）、文档和段落的 API，包括创建、检索和配置功能。
  version: 1.0.0
servers:
  - url: '{apiBaseUrl}'
    description: 知识库 API 的基础 URL。
    variables:
      apiBaseUrl:
        default: https://api.dify.ai/v1
        description: API 的实际基础 URL
security:
  - ApiKeyAuth: []
tags:
  - name: 数据集
    description: 与管理知识库（数据集）相关的操作。
  - name: 文档
    description: 用于在数据集中创建、更新和管理文档的操作。
  - name: 文档块
    description: 用于管理文档块（段落）的操作。
  - name: 元数据和标签
    description: 用于管理数据集标签和元数据的操作。
  - name: 模型
    description: 用于检索可用模型的操作。
paths:
  /datasets/{dataset_id}/document/create-by-file:
    post:
      tags:
        - 文档
      summary: 从文件创建文档
      description: 通过上传文件在现有知识库中创建新文档。
      operationId: createDocumentFromFile
      parameters:
        - name: dataset_id
          in: path
          required: true
          description: 要添加文档的知识库 ID。
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                data:
                  type: string
                  description: >-
                    包含文档元数据和处理规则的 JSON 字符串。详情请参见
                    `CreateDocumentByFileRequestData` 模式。
                  example: >-
                    {"indexing_technique":"high_quality","process_rule":{"mode":"custom",
                    "rules": { "segmentation":{"separator":"###",
                    "max_tokens":500}}}}
                file:
                  type: string
                  format: binary
                  description: 要上传的文件。
      responses:
        '200':
          description: 文档创建成功，正在被索引。
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentCreationResponse'
        '400':
          $ref: '#/components/responses/FileError'
        '413':
          $ref: '#/components/responses/FileTooLarge'
        '415':
          $ref: '#/components/responses/UnsupportedFileType'
components:
  schemas:
    DocumentCreationResponse:
      type: object
      properties:
        document:
          $ref: '#/components/schemas/Document'
        batch:
          type: string
          description: 用于跟踪索引进度的批次标识符。
    Document:
      type: object
      properties:
        id:
          type: string
          format: uuid
        position:
          type: integer
        data_source_type:
          type: string
        data_source_info:
          type: object
          nullable: true
        dataset_process_rule_id:
          type: string
          format: uuid
          nullable: true
        name:
          type: string
        created_from:
          type: string
        created_by:
          type: string
          format: uuid
        created_at:
          type: integer
          format: int64
        tokens:
          type: integer
        indexing_status:
          type: string
        error:
          type: string
          nullable: true
        enabled:
          type: boolean
        disabled_at:
          type: integer
          format: int64
          nullable: true
        disabled_by:
          type: string
          format: uuid
          nullable: true
        archived:
          type: boolean
        display_status:
          type: string
        word_count:
          type: integer
        hit_count:
          type: integer
        doc_form:
          type: string
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: 机器可读的错误代码。
        message:
          type: string
          description: 人类可读的错误消息。
        status:
          type: integer
          description: HTTP 状态码。
      example:
        code: no_file_uploaded
        message: 请上传你的文件。
        status: 400
  responses:
    FileError:
      description: 与文件上传相关的错误请求。可能是 `no_file_uploaded` 或 `too_many_files`。
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    FileTooLarge:
      description: 文件大小超出限制。
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnsupportedFileType:
      description: 不允许的文件类型。
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    ApiKeyAuth:
      type: http
      scheme: bearer
      bearerFormat: API_KEY
      description: >-
        API-Key 鉴权。所有 API 请求都应在 `Authorization` HTTP Header 中包含你的 API-Key，格式为
        `Bearer {API_KEY}`。**强烈建议开发者把 API-Key 放在后端存储，而非分享或者放在客户端存储，以免 API-Key
        泄露，导致财产损失。**

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.dify.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# 用文件更新文档

> 通过上传新文件更新现有文档，替换其内容。



## OpenAPI

````yaml zh/api-reference/openapi_knowledge.json post /datasets/{dataset_id}/documents/{document_id}/update-by-file
openapi: 3.0.1
info:
  title: 知识库 API
  description: 用于管理知识库（数据集）、文档和段落的 API，包括创建、检索和配置功能。
  version: 1.0.0
servers:
  - url: '{apiBaseUrl}'
    description: 知识库 API 的基础 URL。
    variables:
      apiBaseUrl:
        default: https://api.dify.ai/v1
        description: API 的实际基础 URL
security:
  - ApiKeyAuth: []
tags:
  - name: 数据集
    description: 与管理知识库（数据集）相关的操作。
  - name: 文档
    description: 用于在数据集中创建、更新和管理文档的操作。
  - name: 文档块
    description: 用于管理文档块（段落）的操作。
  - name: 元数据和标签
    description: 用于管理数据集标签和元数据的操作。
  - name: 模型
    description: 用于检索可用模型的操作。
paths:
  /datasets/{dataset_id}/documents/{document_id}/update-by-file:
    post:
      tags:
        - 文档
      summary: 用文件更新文档
      description: 通过上传新文件更新现有文档，替换其内容。
      operationId: updateDocumentByFile
      parameters:
        - name: dataset_id
          in: path
          required: true
          description: 包含文档的知识库 ID。
          schema:
            type: string
            format: uuid
        - name: document_id
          in: path
          required: true
          description: 要更新的文档 ID。
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                data:
                  type: string
                  description: >-
                    包含可选文档名称和处理规则的 JSON 字符串。请参见
                    `UpdateDocumentByFileRequestData` 模式。
                  example: '{"name":"new_name.txt","process_rule":{"mode":"automatic"}}'
                file:
                  type: string
                  format: binary
                  description: 要上传的新文件。
      responses:
        '200':
          description: 文档更新成功。
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentCreationResponse'
components:
  schemas:
    DocumentCreationResponse:
      type: object
      properties:
        document:
          $ref: '#/components/schemas/Document'
        batch:
          type: string
          description: 用于跟踪索引进度的批次标识符。
    Document:
      type: object
      properties:
        id:
          type: string
          format: uuid
        position:
          type: integer
        data_source_type:
          type: string
        data_source_info:
          type: object
          nullable: true
        dataset_process_rule_id:
          type: string
          format: uuid
          nullable: true
        name:
          type: string
        created_from:
          type: string
        created_by:
          type: string
          format: uuid
        created_at:
          type: integer
          format: int64
        tokens:
          type: integer
        indexing_status:
          type: string
        error:
          type: string
          nullable: true
        enabled:
          type: boolean
        disabled_at:
          type: integer
          format: int64
          nullable: true
        disabled_by:
          type: string
          format: uuid
          nullable: true
        archived:
          type: boolean
        display_status:
          type: string
        word_count:
          type: integer
        hit_count:
          type: integer
        doc_form:
          type: string
  securitySchemes:
    ApiKeyAuth:
      type: http
      scheme: bearer
      bearerFormat: API_KEY
      description: >-
        API-Key 鉴权。所有 API 请求都应在 `Authorization` HTTP Header 中包含你的 API-Key，格式为
        `Bearer {API_KEY}`。**强烈建议开发者把 API-Key 放在后端存储，而非分享或者放在客户端存储，以免 API-Key
        泄露，导致财产损失。**

````