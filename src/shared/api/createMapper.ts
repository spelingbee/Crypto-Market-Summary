import {MappingError} from "../services";
import {logger} from "../services/logger.ts";

export function createMapper<TDto, TDomain>(
    mapperName: string,
    mappingLogic: (dto: TDto) => TDomain,
    validator: (dto: TDto) => boolean
) {
    return (dto: TDto): TDomain => {
        try {
            const isValid = () => {
                try {
                    return validator(dto);
                } catch (e) {
                    logger.error(`Validator threw for ${mapperName}:`, e);
                    return false;
                }
            };

            if (!isValid) {
                throw new MappingError(`Invalid ${mapperName} DTO: validation failed.`);
            }

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