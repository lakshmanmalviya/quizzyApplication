import { educatorSortingOptions } from '@/services/CommonServices';
import style from '@/styles/educator/CatQuizQuestionRow.module.css';
import { Filters, Role, SortingOption } from '@/types/types';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { DateRange, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import React, { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState } from 'react';


interface EducatorFiltersCardProps {
    applyFilters: (filters: Filters) => void;
    resetFilters: () => void;
    children?: ReactNode;
    by?: string;
    name?: string;
}

const EducatorFiltersCard: React.FC<EducatorFiltersCardProps> = ({ applyFilters, resetFilters, name, children }) => {
    const [filters, setFilters] = useState<Filters>({ page: 0, size: 10 });
    const [selectedSortings, setSelectedSortings] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);

    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sort: selectedSortings.toString(),
        }));
    }, [selectedSortings]);

    useEffect(() => {
        handleApply();
    }, [filters])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilters({
            ...filters,
            query: e.target.value,
        });
    };

    const handleDateChange = (newValue: DateRange<Dayjs>) => {
        setDateRange(newValue);
        const start = newValue[0]?.format('DD-MM-YYYY') ?? '';
        const end = newValue[1]?.format('DD-MM-YYYY') ?? '';
        if (start && end) {
            setFilters((prevFilters) => ({
                ...prevFilters, start: start, end: end
            }));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    const handleApply = () => {
        applyFilters(filters);
    };

    const handleSortingOptionChange = (event: SelectChangeEvent<string[]>) => {
        const selectedValue = event.target.value;
        const newSortings: string[] = typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue;

        const updatedSortings: string[] = newSortings.reduce<string[]>((acc, sorting) => {
            const field = sorting.split(':')[0];
            const isDescending = sorting.endsWith('desc');
            const oppositeSorting = isDescending ? `${field}:asc` : `${field}:desc`;
            const existingSort = acc.find(s => s.startsWith(field));
            if (existingSort) {
                acc = acc.filter(s => s !== existingSort && s !== oppositeSorting);
            }
            acc.push(sorting);
            return acc;
        }, []);

        setSelectedSortings(updatedSortings);
    };

    const handleReset = () => {
        setFilters({ page: 0, size: 10, query: '', role: undefined });
        setSelectedSortings([]);
        setDateRange([null, null]);
        resetFilters();
    };

    const handleRoleChange = (e: SelectChangeEvent<Role>) => {
        setFilters({
            ...filters,
            role: e.target.value as Role,
        });
    };

    return (
        <Box className={style.container}>
            <Typography variant="h6" className={style.title}>
                {name}
            </Typography>

            <Box className={style.controlsContainer}>
                <TextField
                    placeholder="Search"
                    label={
                        <Box className={style.searchLabel}>
                            <SearchIcon className={style.searchIcon} />
                            Search {name}
                        </Box>
                    }
                    variant="outlined"
                    size="small"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    value={filters.query}
                // inputProps={{
                //     end
                // }}
                />
                <FormControl fullWidth margin="normal" variant="outlined" size="small" className={style.formControl}>
                    <InputLabel id="sortby">Sort by</InputLabel>
                    <Select
                        labelId="sortby"
                        id="checkbox"
                        multiple
                        value={selectedSortings}
                        onChange={handleSortingOptionChange}
                        input={<OutlinedInput label="Apply Sorting" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {educatorSortingOptions.map((option: SortingOption) => (
                            <MenuItem key={option.id} value={option.id}>
                                <Checkbox checked={selectedSortings.includes(option.id)} />
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {
                    name && name == 'Users' &&
                    <FormControl fullWidth margin="normal" variant="outlined" size="small" className={style.formControl}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={filters.role ?? ''}
                            onChange={handleRoleChange}
                            label="Role"
                        >
                            <MenuItem value={Role.STUDENT}>Student</MenuItem>
                            <MenuItem value={Role.EDUCATOR}>Educator</MenuItem>
                        </Select>
                    </FormControl>}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        slotProps={{ textField: { size: 'small' } }}
                        className={style.datePicker}
                        onChange={handleDateChange}
                        format='D/M/YYYY'
                        slots={{ field: SingleInputDateRangeField }}
                        label='Pick date range from - to'
                        value={dateRange}
                    />
                </LocalizationProvider>
                <Box>
                    <Button variant="outlined" size="medium" className={style.resetButton} onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
                {children}
            </Box>
        </Box>
    );
};

export default EducatorFiltersCard;
