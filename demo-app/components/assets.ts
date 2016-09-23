import {readFile} from "fs";
import {normalize} from "path";
import {isPresent} from "../../src/core";
import {Injectable} from "../../src/decorators/injectable";
/**
 * Asset loader service
 * @constructor
 * @function
 * @name Assets
 *
 * @description
 * Load assets from disk
 */
@Injectable()
export class Assets {
  /**
   * Load asset from disk
   * @param name
   * @return {Promise<Buffer>}
   */
  async load(name: string): Promise<Buffer> {
    return await <Promise<Buffer>> new Promise(
      (resolve, reject) =>
        readFile(
          normalize(__dirname + "/../../../demo-app/public/" + name),
          (err, data) => isPresent(err) ? reject(err) : resolve(data)
        )
    );
  }
}
