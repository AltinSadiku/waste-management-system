package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.model.*;
import com.kosovo.wastemanagement.repository.AreaRepository;
import com.kosovo.wastemanagement.repository.CollectionScheduleRepository;
import com.kosovo.wastemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CollectionScheduleService {

    private final CollectionScheduleRepository scheduleRepository;
    private final AreaRepository areaRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public CollectionSchedule createSchedule(Long areaId, CollectionSchedule.WasteType wasteType, 
                                           DayOfWeek dayOfWeek, LocalTime collectionTime) {
        Area area = areaRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Area not found with id: " + areaId));
        
        CollectionSchedule schedule = CollectionSchedule.builder()
                .area(area)
                .wasteType(wasteType)
                .dayOfWeek(dayOfWeek)
                .collectionTime(collectionTime)
                .isActive(true)
                .build();
        
        return scheduleRepository.save(schedule);
    }

    public List<CollectionSchedule> getSchedulesByArea(Long areaId) {
        return scheduleRepository.findByAreaIdAndIsActiveTrue(areaId);
    }

    public List<CollectionSchedule> getSchedulesByDay(DayOfWeek dayOfWeek) {
        return scheduleRepository.findByDayOfWeekAndIsActiveTrue(dayOfWeek);
    }

    public CollectionSchedule updateSchedule(Long scheduleId, DayOfWeek dayOfWeek, LocalTime collectionTime) {
        CollectionSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
        
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setCollectionTime(collectionTime);
        
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long scheduleId) {
        CollectionSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
        
        schedule.setIsActive(false);
        scheduleRepository.save(schedule);
    }

//    @Scheduled(cron = "*/30 * * * * *") // Run every 30 seconds for testing
    public void sendCollectionReminders() {
        log.info("Starting collection reminder job...");
        DayOfWeek tomorrow = LocalDateTime.now().plusDays(1).getDayOfWeek();
        List<CollectionSchedule> tomorrowSchedules = getSchedulesByDay(tomorrow);
        
        log.info("Found {} schedules for tomorrow ({})", tomorrowSchedules.size(), tomorrow);
        
        for (CollectionSchedule schedule : tomorrowSchedules) {
            sendCollectionRemindersForSchedule(schedule);
        }
        
        log.info("Collection reminders sent for {} schedules", tomorrowSchedules.size());
    }

    private void sendCollectionRemindersForSchedule(CollectionSchedule schedule) {
        Area area = schedule.getArea();
        
        // Get citizens in the specific area (within 5km radius)
        List<User> citizensInArea = userRepository.findActiveVerifiedCitizensByArea(area.getId());
        
        log.info("Found {} citizens in area '{}' for collection reminders", citizensInArea.size(), area.getName());
        
        Map<String, Object> scheduleData = new HashMap<>();
        scheduleData.put("wasteType", schedule.getWasteType().name().replace("_", " "));
        scheduleData.put("time", schedule.getCollectionTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        scheduleData.put("area", area.getName());
        scheduleData.put("day", schedule.getDayOfWeek().name());
        
        for (User citizen : citizensInArea) {
            try {
                // Send email notification
                emailService.sendCollectionReminderEmail(citizen, scheduleData);
                log.info("Sent collection reminder email to: {}", citizen.getEmail());
                
                // SMS notifications removed - using email notifications only
                
                // Create in-app notification
                notificationService.createNotification(
                    citizen,
                    "Collection Reminder",
                    String.format("Tomorrow's %s collection at %s in %s", 
                        scheduleData.get("wasteType"), 
                        scheduleData.get("time"), 
                        scheduleData.get("area")),
                    Notification.NotificationType.COLLECTION_REMINDER
                );
                
            } catch (Exception e) {
                log.error("Failed to send reminder to user: {}", citizen.getEmail(), e);
            }
        }
    }

    public List<CollectionSchedule> getAllActiveSchedules() {
        return scheduleRepository.findByIsActiveTrue();
    }
}
