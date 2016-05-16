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
            .println(uploadFile("/Users/haiqingzheng/Desktop/v1.5.0开发时间评估.xlsx"));
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
