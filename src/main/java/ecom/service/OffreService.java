package ecom.service;

import ecom.domain.Offre;
import ecom.repository.OffreRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ecom.domain.Offre}.
 */
@Service
@Transactional
public class OffreService {

    private static final Logger LOG = LoggerFactory.getLogger(OffreService.class);

    private final OffreRepository offreRepository;

    public OffreService(OffreRepository offreRepository) {
        this.offreRepository = offreRepository;
    }

    /**
     * Save a offre.
     *
     * @param offre the entity to save.
     * @return the persisted entity.
     */
    public Offre save(Offre offre) {
        LOG.debug("Request to save Offre : {}", offre);
        return offreRepository.save(offre);
    }

    /**
     * Update a offre.
     *
     * @param offre the entity to save.
     * @return the persisted entity.
     */
    public Offre update(Offre offre) {
        LOG.debug("Request to update Offre : {}", offre);
        return offreRepository.save(offre);
    }

    /**
     * Partially update a offre.
     *
     * @param offre the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Offre> partialUpdate(Offre offre) {
        LOG.debug("Request to partially update Offre : {}", offre);

        return offreRepository
            .findById(offre.getId())
            .map(existingOffre -> {
                if (offre.getDescription() != null) {
                    existingOffre.setDescription(offre.getDescription());
                }
                if (offre.getGeolocalisation() != null) {
                    existingOffre.setGeolocalisation(offre.getGeolocalisation());
                }
                if (offre.getIsArchived() != null) {
                    existingOffre.setIsArchived(offre.getIsArchived());
                }

                return existingOffre;
            })
            .map(offreRepository::save);
    }

    /**
     * Get all the offres.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Offre> findAll(Pageable pageable) {
        LOG.debug("Request to get all Offres");
        return offreRepository.findAll(pageable);
    }

    /**
     * Get all the offres with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Offre> findAllWithEagerRelationships(Pageable pageable) {
        return offreRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one offre by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Offre> findOne(Long id) {
        LOG.debug("Request to get Offre : {}", id);
        return offreRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the offre by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Offre : {}", id);
        offreRepository.deleteById(id);
    }
}
