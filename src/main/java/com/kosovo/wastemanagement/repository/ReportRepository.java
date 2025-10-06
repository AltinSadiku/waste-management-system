package com.kosovo.wastemanagement.repository;

import com.kosovo.wastemanagement.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByReporterId(Long reporterId);
    
    List<Report> findByAssignedWorkerId(Long workerId);
    
    List<Report> findByStatus(Report.ReportStatus status);
    
    List<Report> findByAreaId(Long areaId);
    
    @Query("SELECT r FROM Report r WHERE r.status = :status AND r.assignedWorker IS NULL")
    List<Report> findUnassignedReportsByStatus(@Param("status") Report.ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<Report> findReportsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Report r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:areaId IS NULL OR r.area.id = :areaId) AND " +
           "(:priority IS NULL OR r.priority = :priority)")
    Page<Report> findReportsWithFilters(@Param("status") Report.ReportStatus status,
                                       @Param("areaId") Long areaId,
                                       @Param("priority") Report.ReportPriority priority,
                                       Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    Long countByStatus(@Param("status") Report.ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE " +
           "sqrt(power(r.longitude - :longitude, 2) + power(r.latitude - :latitude, 2)) * 111 <= :radiusInKm")
    List<Report> findReportsNearLocation(@Param("latitude") Double latitude,
                                        @Param("longitude") Double longitude,
                                        @Param("radiusInKm") Double radiusInKm);
}
