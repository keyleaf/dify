import logging
import io
import mimetypes
from collections.abc import Generator
from typing import Any, Optional

from core.file.file_manager import download
from core.tools.builtin_tool.tool import BuiltinTool
from core.tools.entities.tool_entities import ToolInvokeMessage
from unstructured.partition.pdf_image.pdf_image_utils import convert_pdf_to_images

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
        mimetype = mimetypes.guess_type("123.pdf")
        logger.info("file {} type is {} mime type is {}".format(file, file.type, file.mime_type))
        if file.mime_type != "application/pdf":  # type: ignore
            yield self.create_text_message("not a valid pdf file")
            return
#       将pdf拆分成图片并返回图片路径列表
        pdf_binary = io.BytesIO(download(file))
        r = list(convert_pdf_to_images("", pdf_binary))
        yield self.create_file_message(r[0])
