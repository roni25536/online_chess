package myShop.chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class ChatController {
    private static Map<String, List<String>> roomIdVsPlayerCount = new HashMap<>();


//    @Autowired
//    private SimpUserRegistry simpUserRegistry;

//    private static int gen5Digits() {
//        Random r = new Random(System.currentTimeMillis());
//        return ((1 + r.nextInt(2)) * 10000 + r.nextInt(10000));
//    }

//    @MessageMapping("chat/greetings/{roomCode}")
//    @SendTo("/topic/greetings/{roomCode}")
//    public ChatMessage<?> greeting(ChatMessage<?> message) throws Exception {
//       // simpUserRegistry.getUsers().forEach(System.out::println);
//        return message;
//    }

    @MessageMapping("/chat/move/{roomCode}")
    @SendTo("/topic/move/{roomCode}")
    public String makeMove(String sourceAndTargetSquares) throws Exception {
        System.out.println("move");
        return sourceAndTargetSquares;
    }

    @MessageMapping("/chat/counter/{roomCode}")
    @SendTo("/topic/counter/{roomCode}")
    public List<String> counter(@DestinationVariable String roomCode, String email) throws Exception {
        if (roomIdVsPlayerCount.containsKey(roomCode)) {
            if (roomIdVsPlayerCount.get(roomCode).size() < 2) {
                roomIdVsPlayerCount.get(roomCode).add(email);
            }
        } else {
            roomIdVsPlayerCount.put(roomCode, new ArrayList<>());
            roomIdVsPlayerCount.get(roomCode).add(email);
        }
        return roomIdVsPlayerCount.get(roomCode);
    }

    @MessageMapping("/chat/clear/{roomCode}")
    @SendTo("/topic/clear/{roomCode}")
    public boolean clearRoom(@DestinationVariable String roomCode) throws Exception {
        if(roomIdVsPlayerCount.containsKey(roomCode)) {
            roomIdVsPlayerCount.remove(roomCode);
            return true;
        }
        return false;
    }

    @MessageMapping("/chat/{roomCode}")
    @SendTo("/topic/{roomCode}")
    public ChatMessage<?> sendMessage(@DestinationVariable String roomCode, ChatMessage<?> message) throws Exception {
        return message;
    }
}
