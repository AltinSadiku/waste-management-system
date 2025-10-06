package com.kosovo.wastemanagement.repository;

import com.kosovo.wastemanagement.model.Bin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinRepository extends JpaRepository<Bin, Long> {
}








