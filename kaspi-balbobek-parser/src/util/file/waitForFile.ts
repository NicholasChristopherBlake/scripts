import { promises as fs } from "fs";

// Интерфейс для ошибки с кодом
interface FileError extends Error {
  code?: string; // Свойство 'code' может быть строкой (например, "EBUSY", "EACCES")
}

/**
 * Проверяет, используется ли файл в данный момент.
 * @param filePath Путь к файлу, который нужно проверить.
 * @returns Возвращает `true`, если файл заблокирован (используется), иначе `false`.
 */

async function isFileInUse(filePath: string): Promise<boolean> {
  try {
    // Пытаемся открыть файл с правами на чтение и запись
    await fs.open(filePath, "r+");
    return false; // Если ошибок нет, значит файл доступен
  } catch (err: unknown) {
    // Проверка, является ли ошибка объектом типа FileError и имеет ли она свойство 'code'
    if (err instanceof Error && (err as FileError).code) {
      const fileError = err as FileError;
      // Если ошибка связана с блокировкой или правами доступа
      if (fileError.code === "EBUSY" || fileError.code === "EACCES") {
        return true;
      }
    }
    // Если другая ошибка, пробрасываем ее дальше
    throw err;
  }
}

/**
 * Ожидает, пока файл станет доступным, проверяя его через регулярные интервалы.
 * @param filePath Путь к файлу.
 * @param retryInterval Интервал между проверками в миллисекундах (по умолчанию 2000 мс).
 * @param maxRetries Максимальное количество попыток перед завершением (по умолчанию 10).
 * @throws Ошибка, если файл так и не стал доступен после максимального количества попыток.
 */
export async function waitForFile(
  filePath: string,
  retryInterval: number = 2000,
  maxRetries: number = 10
): Promise<void> {
  let retries = 0;

  // Цикл, который выполняет попытки до тех пор, пока не будет достигнут лимит повторов
  while (retries < maxRetries) {
    // Проверяем, доступен ли файл
    if (!(await isFileInUse(filePath))) {
      // console.log(`Файл ${filePath} доступен.`);
      return; // Файл доступен, выходим
    }

    retries++;
    console.log(
      `Файл недоступен. Пожалуйста закройте файл. Еще одна попытка через ${
        retryInterval / 1000
      } сек... (${retries}/${maxRetries})`
    );

    // Ждем заданное количество времени перед повторной попыткой
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }

  // Если файл не стал доступен после всех попыток, выбрасываем ошибку
  throw new Error(
    `Файл ${filePath} все еще используется и недоступен после ${maxRetries} попыток.`
  );
}
