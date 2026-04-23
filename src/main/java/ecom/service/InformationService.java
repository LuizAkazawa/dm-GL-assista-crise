package ecom.service;

import ecom.domain.Information;
import ecom.repository.InformationRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ecom.domain.Information}.
 */
@Service
@Transactional
public class InformationService {

    private static final Logger LOG = LoggerFactory.getLogger(InformationService.class);

    private final InformationRepository informationRepository;

    public InformationService(InformationRepository informationRepository) {
        this.informationRepository = informationRepository;
    }

    /**
     * Save a information.
     *
     * @param information the entity to save.
     * @return the persisted entity.
     */
    public Information save(Information information) {
        LOG.debug("Request to save Information : {}", information);
        return informationRepository.save(information);
    }

    /**
     * Update a information.
     *
     * @param information the entity to save.
     * @return the persisted entity.
     */
    public Information update(Information information) {
        LOG.debug("Request to update Information : {}", information);
        return informationRepository.save(information);
    }

    /**
     * Partially update a information.
     *
     * @param information the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Information> partialUpdate(Information information) {
        LOG.debug("Request to partially update Information : {}", information);

        return informationRepository
            .findById(information.getId())
            .map(existingInformation -> {
                if (information.getContenu() != null) {
                    existingInformation.setContenu(information.getContenu());
                }
                if (information.getHorodatage() != null) {
                    existingInformation.setHorodatage(information.getHorodatage());
                }

                return existingInformation;
            })
            .map(informationRepository::save);
    }

    /**
     * Get all the information.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Information> findAll(Pageable pageable) {
        LOG.debug("Request to get all Information");
        return informationRepository.findAll(pageable);
    }

    /**
     * Get all the information with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Information> findAllWithEagerRelationships(Pageable pageable) {
        return informationRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one information by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Information> findOne(Long id) {
        LOG.debug("Request to get Information : {}", id);
        return informationRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the information by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Information : {}", id);
        informationRepository.deleteById(id);
    }
}
