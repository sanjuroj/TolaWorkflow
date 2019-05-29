import React from 'react';
import { observer, inject } from 'mobx-react';
import { MultiSelectCheckbox } from '../../../../components/selectWidgets';


/**
 * input-ready multi-select checkbox widget for filtering IPTT report by level
 * contains both "grouping" and "chaining" filtering options, displayed as two optgroups
 * labeling for second optgroup is based on Program's definition of tier 2 (stored in rootStore.selectedProgram)
 */
const LevelSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        const updateSelected = (selected) => {
            let levelSelects = selected.filter(option => option.filterType == 'level').map(option => option.value);
            let tierSelects = selected.filter(option => option.filterType == 'tier').map(option => option.value);
            if (levelSelects && levelSelects.length > 0 && tierSelects && tierSelects.length > 0) {
                if (filterStore.levels.length == levelSelects.length) {
                    filterStore.tiers = tierSelects;
                } else {
                    filterStore.levels = levelSelects;
                }
            } else if (levelSelects && levelSelects.length > 0) {
                filterStore.levels = levelSelects;
            } else if (tierSelects && tierSelects.length > 0) {
                filterStore.tiers = tierSelects;
            } else {
                filterStore.levels = [];
                filterStore.tiers = [];
            }
        };
        return <MultiSelectCheckbox
                    label={ gettext('Levels') }
                    options={ filterStore.levelOptions }
                    value={
                        filterStore.levels && filterStore.levels.length > 0 ?
                            filterStore.levelsSelected :
                        filterStore.tiers && filterStore.tiers.length > 0 ?
                            filterStore.tiersSelected :
                            []
                    }
                    update={ updateSelected }
                />;
    })
);

/**
 * multi-select checkbox for selecting sites for filtering IPTT */
const SiteSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels sites that a data could be collected at */
                        gettext('Sites')
                    }
                    options={ filterStore.siteOptions }
                    value={ filterStore.sitesSelected }
                    update={ selected => {filterStore.sites = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting types for filtering IPTT */
const TypeSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels types of indicators to filter by */
                        gettext('Types')
                    }
                    options={ filterStore.typeOptions }
                    value={ filterStore.typesSelected }
                    update={ selected => {filterStore.types = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting sectors for filtering IPTT */
const SectorSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels sectors (i.e. 'Food Security') that an indicator can be categorized as */
                        gettext('Sectors')
                    }
                    options={ filterStore.sectorOptions }
                    value={ filterStore.sectorsSelected }
                    update={ selected => {filterStore.sectors = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting indicators for filtering IPTT */
const IndicatorSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels a filter to select which indicators to display */
                        gettext('Indicators')
                    }
                    options={ filterStore.indicatorOptions }
                    value={ filterStore.indicatorsSelected }
                    update={ selected => {filterStore.indicators = selected.map(s => s.value);} }
                />;
    })
);
export { LevelSelect, SiteSelect, TypeSelect, SectorSelect, IndicatorSelect };