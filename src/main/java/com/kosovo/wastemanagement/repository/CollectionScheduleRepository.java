package com.kosovo.wastemanagement.repository;

import com.kosovo.wastemanagement.model.CollectionSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface CollectionScheduleRepository extends JpaRepository<CollectionSchedule, Long> {
    
    List<CollectionSchedule> findByAreaIdAndIsActiveTrue(Long areaId);
    
    List<CollectionSchedule> findByDayOfWeekAndIsActiveTrue(DayOfWeek dayOfWeek);
    
    List<CollectionSchedule> findByIsActiveTrue();
    
    List<CollectionSchedule> findByAreaIdAndWasteTypeAndIsActiveTrue(Long areaId, CollectionSchedule.WasteType wasteType);
}