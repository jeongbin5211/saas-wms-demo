package com.wms.wms_backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndProcessApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void apiRequestsWithoutTokenRedirectToLogin() throws Exception {
        mockMvc.perform(get("/api/inventories"))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    void guestCanReadAndConfirmShippingForDemo() throws Exception {
        String guestToken = login("guest@saas-wms-demo.com", "guest1234");

        mockMvc.perform(get("/api/inventories")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/shippings/1/confirm")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shippingStatusSubCode").value("CONFIRMED"))
                .andExpect(jsonPath("$.billStatusSubCode").value("ISSUED"));
    }

    @Test
    void staffCanConfirmShippingAndReadBill() throws Exception {
        String staffToken = login("staff@saas-wms-demo.com", "guest1234");

        mockMvc.perform(post("/api/shippings/1/confirm")
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shippingStatusSubCode").value("CONFIRMED"))
                .andExpect(jsonPath("$.billStatusSubCode").value("ISSUED"));
    }

    private String login(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        return jsonNode.get("token").asText();
    }
}
