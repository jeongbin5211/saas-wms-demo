package com.wms.wms_backend.domain.auth.oauth2;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo userInfo = OAuth2UserInfo.of(provider, oAuth2User.getAttributes());
        User user = findOrCreateUser(provider, userInfo);

        return new OAuth2UserPrincipal(user, oAuth2User.getAttributes());
    }

    private User findOrCreateUser(String provider, OAuth2UserInfo userInfo) {
        return userRepository.findByEmail(userInfo.email())
                .map(user -> {
                    user.linkOAuth(provider, userInfo.oauthId());
                    return user;
                })
                .orElseGet(() -> createOAuthUser(provider, userInfo));
    }

    private User createOAuthUser(String provider, OAuth2UserInfo userInfo) {
        String accountCode = (provider + "-" + userInfo.oauthId()).toUpperCase();
        Account account = accountRepository.save(new Account(null, accountCode, userInfo.name() + " 계정", "CUSTOMER"));
        account.assignTopAccountId(account.getId());

        User user = new User(account, account.getTopAccountId(), userInfo.name(), userInfo.email(), "GUEST");
        user.linkOAuth(provider, userInfo.oauthId());
        return userRepository.save(user);
    }

    public record OAuth2UserInfo(String oauthId, String email, String name) {

        @SuppressWarnings("unchecked")
        public static OAuth2UserInfo of(String provider, Map<String, Object> attributes) {
            return switch (provider) {
                case "google" -> new OAuth2UserInfo(
                        String.valueOf(attributes.get("sub")),
                        String.valueOf(attributes.get("email")),
                        String.valueOf(attributes.get("name"))
                );
                case "kakao" -> {
                    Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    yield new OAuth2UserInfo(
                            String.valueOf(attributes.get("id")),
                            String.valueOf(kakaoAccount.get("email")),
                            String.valueOf(profile.get("nickname"))
                    );
                }
                default -> throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 공급자: " + provider);
            };
        }
    }
}
