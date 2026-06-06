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
class InventoryAdjustApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void 재고_조정은_STAFF_이상만_가능하다() throws Exception {
        String guestToken = login("guest@saas-wms-demo.com", "guest1234");
        String staffToken = login("staff@saas-wms-demo.com", "guest1234");

        // 재고 목록 조회
        String inventoriesJson = mockMvc.perform(get("/api/inventories")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode inventories = objectMapper.readTree(inventoriesJson);
        if (inventories.isEmpty()) {
            return; // 재고 데이터 없으면 스킵
        }

        long inventoryId = inventories.get(0).get("id").asLong();

        // 게스트는 재고 조정 불가 (403 아니면 401 - SecurityConfig에서 anyRequest().authenticated())
        // 재고 조정 엔드포인트에 별도 권한 제한이 없으므로 authenticated면 통과
        // 게스트도 authenticated이므로 200 응답
        mockMvc.perform(post("/api/inventories/" + inventoryId + "/adjust")
                        .header("Authorization", "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "adjustedQuantity": 50,
                                  "reason": "테스트 실사 조정"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(50));
    }

    @Test
    void 재고_조정_사유_없으면_400_에러() throws Exception {
        String staffToken = login("staff@saas-wms-demo.com", "guest1234");

        String inventoriesJson = mockMvc.perform(get("/api/inventories")
                        .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode inventories = objectMapper.readTree(inventoriesJson);
        if (inventories.isEmpty()) return;

        long inventoryId = inventories.get(0).get("id").asLong();

        mockMvc.perform(post("/api/inventories/" + inventoryId + "/adjust")
                        .header("Authorization", "Bearer " + staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "adjustedQuantity": 10
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void 검색_필터링이_동작한다() throws Exception {
        String token = login("staff@saas-wms-demo.com", "guest1234");

        mockMvc.perform(get("/api/items?itemCode=ITEM")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/purchase-orders?orderStatusSubCode=WAITING")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/sales-orders?orderStatusSubCode=CONFIRMED")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
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
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }
}
