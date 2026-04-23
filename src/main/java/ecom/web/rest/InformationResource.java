package ecom.web.rest;

import ecom.domain.Information;
import ecom.repository.InformationRepository;
import ecom.service.InformationService;
import ecom.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ecom.domain.Information}.
 */
@RestController
@RequestMapping("/api/information")
public class InformationResource {

    private static final Logger LOG = LoggerFactory.getLogger(InformationResource.class);

    private static final String ENTITY_NAME = "information";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InformationService informationService;

    private final InformationRepository informationRepository;

    public InformationResource(InformationService informationService, InformationRepository informationRepository) {
        this.informationService = informationService;
        this.informationRepository = informationRepository;
    }

    /**
     * {@code POST  /information} : Create a new information.
     *
     * @param information the information to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new information, or with status {@code 400 (Bad Request)} if the information has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Information> createInformation(@Valid @RequestBody Information information) throws URISyntaxException {
        LOG.debug("REST request to save Information : {}", information);
        if (information.getId() != null) {
            throw new BadRequestAlertException("A new information cannot already have an ID", ENTITY_NAME, "idexists");
        }
        information = informationService.save(information);
        return ResponseEntity.created(new URI("/api/information/" + information.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, information.getId().toString()))
            .body(information);
    }

    /**
     * {@code PUT  /information/:id} : Updates an existing information.
     *
     * @param id the id of the information to save.
     * @param information the information to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated information,
     * or with status {@code 400 (Bad Request)} if the information is not valid,
     * or with status {@code 500 (Internal Server Error)} if the information couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Information> updateInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Information information
    ) throws URISyntaxException {
        LOG.debug("REST request to update Information : {}, {}", id, information);
        if (information.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, information.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!informationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        information = informationService.update(information);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, information.getId().toString()))
            .body(information);
    }

    /**
     * {@code PATCH  /information/:id} : Partial updates given fields of an existing information, field will ignore if it is null
     *
     * @param id the id of the information to save.
     * @param information the information to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated information,
     * or with status {@code 400 (Bad Request)} if the information is not valid,
     * or with status {@code 404 (Not Found)} if the information is not found,
     * or with status {@code 500 (Internal Server Error)} if the information couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Information> partialUpdateInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Information information
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Information partially : {}, {}", id, information);
        if (information.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, information.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!informationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Information> result = informationService.partialUpdate(information);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, information.getId().toString())
        );
    }

    /**
     * {@code GET  /information} : get all the information.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of information in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Information>> getAllInformation(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Information");
        Page<Information> page;
        if (eagerload) {
            page = informationService.findAllWithEagerRelationships(pageable);
        } else {
            page = informationService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /information/:id} : get the "id" information.
     *
     * @param id the id of the information to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the information, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Information> getInformation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Information : {}", id);
        Optional<Information> information = informationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(information);
    }

    /**
     * {@code DELETE  /information/:id} : delete the "id" information.
     *
     * @param id the id of the information to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInformation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Information : {}", id);
        informationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
