package ecom.service;

import ecom.domain.Crise;
import ecom.repository.CriseRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ecom.domain.Crise}.
 */
@Service
@Transactional
public class CriseService {

    private static final Logger LOG = LoggerFactory.getLogger(CriseService.class);

    private final CriseRepository criseRepository;

    public CriseService(CriseRepository criseRepository) {
        this.criseRepository = criseRepository;
    }

    /**
     * Save a crise.
     *
     * @param crise the entity to save.
     * @return the persisted entity.
     */
    public Crise save(Crise crise) {
        LOG.debug("Request to save Crise : {}", crise);
        return criseRepository.save(crise);
    }

    /**
     * Update a crise.
     *
     * @param crise the entity to save.
     * @return the persisted entity.
     */
    public Crise update(Crise crise) {
        LOG.debug("Request to update Crise : {}", crise);
        return criseRepository.save(crise);
    }

    /**
     * Partially update a crise.
     *
     * @param crise the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Crise> partialUpdate(Crise crise) {
        LOG.debug("Request to partially update Crise : {}", crise);

        return criseRepository
            .findById(crise.getId())
            .map(existingCrise -> {
                if (crise.getNom() != null) {
                    existingCrise.setNom(crise.getNom());
                }
                if (crise.getNature() != null) {
                    existingCrise.setNature(crise.getNature());
                }
                if (crise.getDateDebut() != null) {
                    existingCrise.setDateDebut(crise.getDateDebut());
                }
                if (crise.getDateFin() != null) {
                    existingCrise.setDateFin(crise.getDateFin());
                }
                if (crise.getIsActive() != null) {
                    existingCrise.setIsActive(crise.getIsActive());
                }

                return existingCrise;
            })
            .map(criseRepository::save);
    }

    /**
     * Get all the crises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Crise> findAll(Pageable pageable) {
        LOG.debug("Request to get all Crises");
        return criseRepository.findAll(pageable);
    }

    /**
     * Get one crise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Crise> findOne(Long id) {
        LOG.debug("Request to get Crise : {}", id);
        return criseRepository.findById(id);
    }

    /**
     * Delete the crise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Crise : {}", id);
        criseRepository.deleteById(id);
    }
}
