package myShop.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.*;

@Configuration
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static Map<String, HashSet<String>> roomIdVsPlayerCount = new HashMap<>();
    private static final int PLAYERS_LIMIT = 2;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat").setAllowedOrigins("http://localhost:3000").withSockJS();
    }

//    @Override
//    public void configureClientInboundChannel(ChannelRegistration registration) {
//        WebSocketMessageBrokerConfigurer.super.configureClientInboundChannel(registration);
//        registration.interceptors(new ChannelInterceptor() {
//            @Override
//            public Message<?> preSend(Message<?> message, MessageChannel channel) {
//                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
//                String roomId = accessor.getDestination();
//                String userSessionId = accessor.getSessionId();
//                roomIdVsPlayerCount.forEach((currRoomId, players) -> System.out.println(currRoomId + " - " + players));
//                if (accessor.getHeader("stompCommand").toString().equals("DISCONNECT")) {
//                    roomIdVsPlayerCount.forEach((currRoomId, players) -> players.remove(userSessionId));
//                }
//
//                if (roomId == null) {
//
//                    return message;
//                }
//
//                if (isRoomFull(roomId, userSessionId)) {
//
//                    return null;
//                } else {
//                    addUserToRoom(roomId, userSessionId);
//                }
//
//                return message;
//            }
//        });
//    }

    public static boolean isRoomFull(String roomId, String userSessionId) {
        if (!roomIdVsPlayerCount.containsKey(roomId)) {
            return false;
        }
        HashSet<String> currentRoom = roomIdVsPlayerCount.get(roomId);
        return currentRoom.size() == PLAYERS_LIMIT && !currentRoom.contains(userSessionId);
    }

    public static void addUserToRoom(String roomId, String userSessionId) {
        if (!roomIdVsPlayerCount.containsKey(roomId)) {
            roomIdVsPlayerCount.put(roomId, new HashSet<>());
        }
        roomIdVsPlayerCount.get(roomId).add(userSessionId);
    }
}
