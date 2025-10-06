package com.kosovo.wastemanagement.repository;

import com.kosovo.wastemanagement.model.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    
    List<Area> findByMunicipality(String municipality);
    
    List<Area> findByIsActiveTrue();
    
    @Query("SELECT a FROM Area a WHERE a.name ILIKE %:searchTerm% OR a.neighborhood ILIKE %:searchTerm%")
    List<Area> findByNameOrNeighborhoodContaining(@Param("searchTerm") String searchTerm);
}






