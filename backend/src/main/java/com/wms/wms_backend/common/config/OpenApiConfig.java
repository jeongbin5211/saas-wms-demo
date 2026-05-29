package com.wms.wms_backend.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        Info info = new Info()
                .title("SaaS WMS Demo API")
                .description("범용 물류창고 OMS/WMS 데모 프로젝트 API 문서")
                .version("v1.0.0");

        return new OpenAPI().info(info);
    }
}
