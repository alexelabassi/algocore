package org.algocore.algocorebackend.mapper;

import org.algocore.algocorebackend.dto.auth.UserResponseDto;
import org.algocore.algocorebackend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDto userToUserResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole()
        );
    }
}
