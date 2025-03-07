import io
import logging
from collections.abc import Generator
from pathlib import Path
from typing import Any, Optional

import pdf2image
from unstructured.partition.common.common import convert_to_bytes

from core.file.file_manager import download
from core.tools.builtin_tool.tool import BuiltinTool
from core.tools.entities.tool_entities import ToolInvokeMessage

logger = logging.getLogger(__name__)


class PdfToImageTool(BuiltinTool):
    def _invoke(
            self,
            user_id: str,
            tool_parameters: dict[str, Any],
            conversation_id: Optional[str] = None,
            app_id: Optional[str] = None,
            message_id: Optional[str] = None,
    ) -> Generator[ToolInvokeMessage, None, None]:
        file = tool_parameters.get("pdf_file")
        logger.info("file {} type is {} mime type is {}".format(file, file.type, file.mime_type))
        if file.mime_type != "application/pdf":  # type: ignore
            yield self.create_text_message("not a valid pdf file")
            return
        #       将pdf拆分成图片并返回图片路径列表
        pdf_binary = io.BytesIO(download(file))
        f_bytes = convert_to_bytes(pdf_binary)
        images = list(pdf2image.convert_from_bytes(f_bytes, fmt="jpg", output_folder="/app/api/storage/pdf_to_images"))

        result = []
        for image in images:
            imageFile = Path(image.filename).read_bytes()
            yield self.create_blob_message(imageFile,
                                           meta={'mime_type': 'image/jpeg'})

        # logger.info("dir is {}".format(image))
