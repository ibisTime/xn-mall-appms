package com.xnjr.moom.front.util;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.codec.binary.Base64;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.xnjr.moom.front.exception.BizException;

/** 
 * SFTP远程连接服务器，上传文件工具类
 * @author: haiqingzheng 
 * @since: 2015年10月20日 下午1:52:17 
 * @history:
 */
public class UploadUtil {

    /** 
     * @param args 
     * @create: 2015年10月20日 下午1:52:17 haiqingzheng
     * @history: 
     */
    public static void main(String[] args) {
        System.out
            .println(uploadPicture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MURCRDFDNDgxNDFGMTFFNjkyOERCMTFDRkFCQkRGNDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ5MjI5MkUxNDFGMTFFNjkyOERCMTFDRkFCQkRGNDAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxREJEMUM0NjE0MUYxMUU2OTI4REIxMUNGQUJCREY0MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxREJEMUM0NzE0MUYxMUU2OTI4REIxMUNGQUJCREY0MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoZBxncAAD0eSURBVHja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"));
    }

    /**
     * 文件上传
     * @param filePath 文件本地路径
     * @return 
     * @create: 2016年1月25日 下午4:00:59 haiqingzheng
     * @history:
     */
    public static String uploadFile(String filePath) {

        String path = null;
        
        String urlPrefix = ConfigProperties.Config.URL_PREFIX;
        String host = ConfigProperties.Config.HOST;
        int port = Integer.valueOf(ConfigProperties.Config.PORT);
        String username = ConfigProperties.Config.USERNAME;
        String password = ConfigProperties.Config.PASSWORD;
        String filePreDir = ConfigProperties.Config.PRE_DIR;

        ChannelSftp sftp = null;
        Channel channel = null;
        Session sshSession = null;

        try {
            // SFTP远程连接服务器
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp) channel;

            BufferedInputStream fis = new BufferedInputStream(
                new FileInputStream(filePath));

            // 创建时间目录和随机文件名
            SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHH");
            String date = dateformat.format(new Date());
            String dir = filePreDir + date;

            // 通过文件路径解析文件名
            String fileName = "";
            int index = filePath.lastIndexOf("/");
            if (index != -1 && index > 0) {
                fileName = filePath.substring(index + 1, filePath.length());
            } else {
                throw new BizException("XN000000", "文件路径格式不正确");
            }

            String dstString = dir + "/" + fileName;

            // 判断目录是否存在，不存在则创建新目录
            try {
                sftp.ls(dir);
            } catch (SftpException e) {
                sftp.mkdir(dir);
            }
            sftp.put(fis, dstString);
            path = urlPrefix + date + "/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeChannel(sftp);
            closeChannel(channel);
            closeSession(sshSession);
        }

        return path;
    }

    /**
     * 图片上传
     * @param base64String
     * @return 
     * @create: 2016年1月25日 下午4:00:52 haiqingzheng
     * @history:
     */
    public static String uploadPicture(String base64String) {
        // 参数检测
        Pattern pattern = Pattern.compile("data:image/(.+?);base64");
        Matcher matcher = pattern.matcher(base64String);
        if (!matcher.find()) {
            System.out.println("请传入正确的base64编码格式的图片");
            return null;
        }
        // 取得图片后缀名
        String suffix = matcher.group(1);

        String path = null;

        String urlPrefix = ConfigProperties.Config.URL_PREFIX;
        String host = ConfigProperties.Config.HOST;
        int port = Integer.valueOf(ConfigProperties.Config.PORT);
        String username = ConfigProperties.Config.USERNAME;
        String password = ConfigProperties.Config.PASSWORD;
        String filePreDir = ConfigProperties.Config.PRE_DIR;

        ChannelSftp sftp = null;
        Channel channel = null;
        Session sshSession = null;

        try {
            // SFTP远程连接图片服务器
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp) channel;

            // 将base64编码的图片转化成二进制流
            String header = "data:image/" + suffix + ";base64,";
            base64String = base64String.substring(header.length());
            byte[] decoderBytes = Base64.decodeBase64(base64String);
            ByteArrayInputStream fis = new ByteArrayInputStream(decoderBytes);

            // 创建时间目录和随机文件名
            SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHH");
            String date = dateformat.format(new Date());
            String dir = filePreDir + date;
            String picName = generate()
                    + "."
                    + ("jpeg".equalsIgnoreCase(suffix) ? "jpg" : suffix
                        .toLowerCase());
            String dstString = dir + "/" + picName;

            // 判断目录是否存在，不存在则创建新目录
            try {
                sftp.ls(dir);
            } catch (SftpException e) {
                sftp.mkdir(dir);
            }
            sftp.put(fis, dstString);
            path = urlPrefix + date + "/" + picName;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeChannel(sftp);
            closeChannel(channel);
            closeSession(sshSession);
        }

        return path;
    }

    private static void closeChannel(Channel channel) {
        if (channel != null) {
            if (channel.isConnected()) {
                channel.disconnect();
            }
        }
    }

    private static void closeSession(Session session) {
        if (session != null) {
            if (session.isConnected()) {
                session.disconnect();
            }
        }
    }

    /**
     * 根据当前时间生成一个随机数
     * @return 
     * @create: 2015年10月22日 上午10:57:25 haiqingzheng
     * @history:
     */
    public static String generate() {
        int random = Math.abs(new Random().nextInt()) % 100000000;
        String today = dateToStr(new Date(), "yyyyMMDDhhmmss")
                + String.valueOf(random);
        return today;
    }

    /** 
     * Date按格式pattern转String
     * @param date
     * @param pattern
     * @return 
     * @create: 2015-4-18 下午11:02:34 miyb
     * @history: 
     */
    public static String dateToStr(Date date, String pattern) {
        String str = null;
        SimpleDateFormat formater = new SimpleDateFormat(pattern);
        try {
            str = formater.format(date);
        } catch (Exception e) {
        }
        return str;
    }
}
