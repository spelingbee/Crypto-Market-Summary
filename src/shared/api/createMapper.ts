import {MappingError} from "../services";
import {logger} from "../services/logger.ts";

export function createMapper<TDto, TDomain>(
    mapperName: string,
    mappingLogic: (dto: TDto) => TDomain,
    validator: (dto: TDto) => boolean
) {
    return (dto: TDto): TDomain => {
        if (!validator(dto)) {
            throw new MappingError(`Invalid ${mapperName} DTO: validation failed.`);
        }
        try {
            return mappingLogic(dto);
        } catch (e: unknown) {
            logger.error(`Failed to map ${mapperName} DTO:`, e);
            if (e instanceof Error) {
                throw new MappingError(`Mapping failed: ${e.message}`, { cause: e });
            }
            throw new MappingError('An unknown error occurred during mapping.', { cause: e });
        }
    };
}