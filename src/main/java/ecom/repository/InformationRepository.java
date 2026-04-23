package ecom.repository;

import ecom.domain.Information;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Information entity.
 */
@Repository
public interface InformationRepository extends JpaRepository<Information, Long> {
    default Optional<Information> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Information> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Information> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select information from Information information left join fetch information.utilisateur left join fetch information.crise",
        countQuery = "select count(information) from Information information"
    )
    Page<Information> findAllWithToOneRelationships(Pageable pageable);

    @Query("select information from Information information left join fetch information.utilisateur left join fetch information.crise")
    List<Information> findAllWithToOneRelationships();

    @Query(
        "select information from Information information left join fetch information.utilisateur left join fetch information.crise where information.id =:id"
    )
    Optional<Information> findOneWithToOneRelationships(@Param("id") Long id);
}
